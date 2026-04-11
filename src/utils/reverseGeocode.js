export const reverseGeocode = async (lat, lng) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
  );

  const data = await res.json();

  return {
    village:
      data.address.village || data.address.town || data.address.city || "",
    district: data.address.county || "",
    state: data.address.state || "",
  };
};
