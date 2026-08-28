export const calculateDistance = (userLat : number, userLong : number, companyLat : number, companyLong : number) : number  => {
    const earthRadius:number = 6371;

    const dLat : number = toRadians(companyLat - userLat);
    const dLong : number = toRadians(companyLong - userLong);

      const a : number =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(userLat)) *
      Math.cos(toRadians(companyLat)) *
      Math.sin(dLong / 2) ** 2;

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return earthRadius * c;
}

export const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
}