import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./LocationPicker.module.css";

export default function LocationPicker(){
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    axios
      .get("https://crio-location-selector.onrender.com/countries")
      .then((res) => setCountryList(res.data))
      .catch((err) => console.error("Failed to fetch countries", err));
  }, []);

  useEffect(() => {
    if (!country) return;
    axios
      .get(`https://crio-location-selector.onrender.com/country=${country}/states`)
      .then((res) => {
        setStateList(res.data);
        setState("");
        setCityList([]);
        setCity("");
      })
      .catch((err) => console.error("Failed to fetch states", err));
  }, [country]);

  useEffect(() => {
    if (!state) return;
    axios
      .get(`https://crio-location-selector.onrender.com/country=${country}/state=${state}/cities`)
      .then((res) => {
        setCityList(res.data);
        setCity("");
      })
      .catch((err) => console.error("Failed to fetch cities", err));
  }, [country, state]);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>Choose Your Location</h1>
      <div className={styles.selectRow}>
        <select
          className={styles.dropdown}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="" disabled>Select Country</option>
          {countryList.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className={styles.dropdown}
          value={state}
          onChange={(e) => setState(e.target.value)}
          disabled={!country}
        >
          <option value="" disabled>Select State</option>
          {stateList.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className={styles.dropdown}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={!state}
        >
          <option value="" disabled>Select City</option>
          {cityList.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {city && (
        <div className={styles.output}>
          Selected:
          <span className={styles.cityName}> {city}</span>,
          <span className={styles.details}> {state}, {country}</span>
        </div>
      )}
    </div>
  );
}