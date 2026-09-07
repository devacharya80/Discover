import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  HelpCircle,
  Loader2,
  MapPin,
} from "lucide-react";

import type { UserLocationType } from "../../types/user.type";

interface UserLocationRegisterProps {
  locationData: UserLocationType;
  onLocationChange: (location: UserLocationType) => void;
  onRegister: () => Promise<void>;
  onSkip: () => Promise<void>;
  onBack: () => void;
  loading: boolean;
}

function UserLocationRegister({
  locationData,
  onLocationChange,
  onRegister,
  onSkip,
  onBack,
  loading,
}: UserLocationRegisterProps) {
  const [locating, setLocating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const handleLocationRegisterInputs = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    onLocationChange({
      ...locationData,
      [name]: value,
    });
  };

  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }

    setLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const addr = data.address || {};

          onLocationChange({
            address:
              addr.road ||
              addr.suburb ||
              addr.neighbourhood ||
              addr.city_district ||
              "",
            city: addr.city || addr.town || addr.village || addr.county || "",
            state: addr.state || "",
            country: addr.country || "India",
            pincode: addr.postcode || "",
            latitude,
            longitude,
          });
        } catch {
          // Fallback to storing raw coordinates if reverse-geocoding fails
          onLocationChange({
            ...locationData,
            latitude,
            longitude,
          });
          setGeoError("Unable to fetch street address. Coords saved; please fill address manually.");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setGeoError(err.message || "Location permission denied or unavailable");
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmCreate = async () => {
    setShowConfirmModal(false);
    await onRegister();
  };

  return (
    <>
      <motion.form
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        onSubmit={handleFormSubmit}
        className="space-y-4 sm:space-y-5"
      >
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={loading || locating}
            className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 disabled:opacity-50"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAutoLocate}
            disabled={locating || loading}
            className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-100 disabled:opacity-50"
          >
            {locating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Compass size={14} />
            )}
            <span>{locating ? "Locating..." : "Locate Me"}</span>
          </motion.button>
        </div>

        <div>
          <div className="mb-2 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <MapPin size={20} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            Where are you?
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            Add your location to discover companies near you.
          </p>
        </div>

        {geoError && (
          <div className="rounded-lg bg-red-50 p-2 text-xs text-red-600 border border-red-100">
            {geoError}
          </div>
        )}

        <LocationInput
          label="Address"
          name="address"
          id="address"
          value={locationData.address}
          onChange={handleLocationRegisterInputs}
          placeholder="Street / Area"
          required
        />

        <LocationInput
          label="City"
          name="city"
          id="city"
          value={locationData.city}
          onChange={handleLocationRegisterInputs}
          placeholder="Bengaluru"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LocationInput
            label="State"
            name="state"
            id="state"
            value={locationData.state}
            onChange={handleLocationRegisterInputs}
            placeholder="Karnataka"
            required
          />

          <LocationInput
            label="Pincode"
            name="pincode"
            id="pincode"
            value={locationData.pincode}
            onChange={handleLocationRegisterInputs}
            placeholder="560001"
            required
          />
        </div>

        <LocationInput
          label="Country"
          name="country"
          id="country"
          value={locationData.country}
          onChange={handleLocationRegisterInputs}
          placeholder="India"
          required
        />

        {locationData.latitude !== undefined && locationData.longitude !== undefined && (
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-2.5 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Lat: {locationData.latitude.toFixed(4)}</span>
            <span>Long: {locationData.longitude.toFixed(4)}</span>
            <span className="font-medium text-blue-600">Geo Tagged</span>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || locating}
          className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Register with Location
              <Check size={18} />
            </>
          )}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onSkip}
          disabled={loading || locating}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium text-gray-500 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Skip for now
          <ArrowRight size={16} />
        </motion.button>
      </motion.form>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 25 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="w-full max-w-sm rounded-2xl border border-white/40 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <HelpCircle size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Confirm Address
                  </h3>
                  <p className="text-xs text-gray-500">
                    Permanent Address Verification
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs text-gray-600 border border-gray-100 space-y-1">
                <p className="font-semibold text-gray-800">Selected details:</p>
                <p className="truncate">{locationData.address}, {locationData.city}</p>
                <p>{locationData.state}, {locationData.pincode}</p>
                {locationData.latitude !== undefined && locationData.longitude !== undefined && (
                  <p className="text-gray-400">
                    Coords: {locationData.latitude.toFixed(4)}, {locationData.longitude.toFixed(4)}
                  </p>
                )}
              </div>

              <p className="mt-3 text-sm text-gray-600">
                Is this your <strong>permanent address</strong>? We will create your location record only if you confirm.
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  No, Edit
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCreate}
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 transition-colors"
                >
                  <Check size={16} />
                  Yes, Create
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

interface LocationInputProps {
  label: string;
  name: string;
  id: string;
  value: string;
  placeholder: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function LocationInput({
  label,
  name,
  id,
  value,
  placeholder,
  required = false,
  onChange,
}: LocationInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs sm:text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        type="text"
        name={name}
        id={id}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}

export default UserLocationRegister;