import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";

import { getAvailablePropertyTypes } from "src/api";

import styles from "./PropertyFilter.module.scss";

export function PropertyFilter({ onPropertySelect, currentPropertyType }) {
  const [propertyTypes, setPropertyTypes] = useState([]);

  const { addToast } = useToasts();

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const { propertyTypes } = await getAvailablePropertyTypes();

        propertyTypes.unshift({ label: "All", value: undefined });

        setPropertyTypes(propertyTypes);
      } catch (e) {
        addToast(e.message, { appearance: "error" });
      }
    };

    fetchPropertyTypes();
  }, [addToast]);

  const handlePropertyClick = (e, propertyTypeValue) => {
    e.preventDefault();
    onPropertySelect(propertyTypeValue);
  };

  return (
    <ul className={styles.propertyList}>
      {propertyTypes.map((propertyType, index) => {
        return (
          <li key={index} className={styles.propertyListItem}>
            <a
              href="#propertyValue"
              className={
                currentPropertyType === propertyType.value
                  ? styles.selected
                  : undefined
              }
              onClick={(e) => handlePropertyClick(e, propertyType.value)}
            >
              {propertyType.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
