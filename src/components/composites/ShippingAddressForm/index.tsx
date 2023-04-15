"use client";

import styles from "@styles/composites/ShippingAddressForm.module.scss";
import { useEffect, useState } from "react";

import { ShippingAddress } from "@/types/order";
import { State, City } from "country-state-city";

export interface Props {
  onChange?: (address: ShippingAddress) => void;
}

export default function ShippingAddressForm({ onChange }: Props) {
  const [name, setName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [email, setEmail] = useState("");

  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const shippingAddress = getShippingAddressFromLocalStorage();
    if (shippingAddress) {
      setName(shippingAddress.name);
      setAddress1(shippingAddress.address1);
      setAddress2(shippingAddress.address2 || "");
      setCity(shippingAddress.city);
      setState(shippingAddress.state);
      setZip(shippingAddress.zip);
      setEmail(shippingAddress.email);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (onChange) {
      onChange({
        name,
        address1,
        address2: address2 === "" ? undefined : address2,
        city,
        state,
        zip,
        email,
      });
    }

    if (firstLoad) {
      setFirstLoad(false);
      return;
    }

    saveShippingAddressToLocalStorage({
      name,
      address1,
      address2: address2 === "" ? undefined : address2,
      city,
      state,
      zip,
      email,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, address1, address2, city, state, zip, email]);

  return (
    <form className={styles.wrapper}>
      <div className={styles.field}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="address1">Address (Line 1)</label>
        <input
          type="text"
          id="address"
          value={address1}
          onChange={(e) => {
            setAddress1(e.target.value);
          }}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="address2">Address (Line 2)</label>
        <input
          type="text"
          id="address2"
          value={address2}
          onChange={(e) => setAddress2(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="state">State</label>
        <select
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
          <option value="">Select a state</option>
          {State.getStatesOfCountry("US").map((state) => (
            <option key={state.isoCode} value={state.isoCode}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="city">City</label>
        <select
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="">Select a city</option>
          {City.getCitiesOfState("US", state).map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="zip">Zip</label>
        <input
          type="text"
          id="zip"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
    </form>
  );
}

ShippingAddressForm.displayName = "ShippingAddressForm";

// save shipping address to local storage
function saveShippingAddressToLocalStorage(shippingAddress: ShippingAddress) {
  localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
}

// get shipping address from local storage
function getShippingAddressFromLocalStorage(): ShippingAddress | null {
  const shippingAddress = localStorage.getItem("shippingAddress");

  if (shippingAddress) {
    return JSON.parse(shippingAddress);
  }

  return null;
}
