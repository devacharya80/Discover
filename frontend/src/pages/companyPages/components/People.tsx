interface PeopleProps {
  count: number;
}

function People({ count }: PeopleProps) {
  return (
    <section className="p-6">
      <h2 className="text-lg font-semibold text-gray-900">
        People
      </h2>

      <p>
        {count}
      </p>
    </section>
  );
}

export default People;