import { useCallback, useEffect, useState } from "react";
import { ToastProvider, useToasts } from "react-toast-notifications";

import {
  Table,
  TableRow,
  TableHeadCell,
  TableCell,
} from "src/components/Table";
import { Button } from "src/components/Buttons";
import { TextInput } from "src/components/Inputs";
import { AppHeader } from "src/components/AppHeader";
import { PropertyFilter } from "src/components/PropertyFilter";
import { fetchProperties, fetchPropertyDetails } from "src/api";

import "src/styling/_global.scss";

import styles from "./App.module.scss";

function EmptyState({ children }) {
  return <p className={styles.emptyState}>{children}</p>;
}

function PropertyTableHeadCells() {
  return (
    <>
      <TableHeadCell>Address</TableHeadCell>
      <TableHeadCell>Postcode</TableHeadCell>
      <TableHeadCell>Number of Rooms</TableHeadCell>
      <TableHeadCell>Floor Area (m²)</TableHeadCell>
    </>
  );
}

function PropertyRow({ property }) {
  return (
    <>
      <TableCell>{property.address}</TableCell>
      <TableCell>{property.postcode}</TableCell>
      <TableCell>{property.numberOfRooms}</TableCell>
      <TableCell>{property.floorArea}</TableCell>
    </>
  );
}

function SearchBar({ onSubmit }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchBar}>
      <TextInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Address"
      />
      <div className={styles.searchButtonWrapper}>
        <Button type="submit">Search</Button>
      </div>
    </form>
  );
}

export function AppComponent() {
  const [searchedProperties, setSearchedProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [propertyType, setCurrentPropertyType] = useState(undefined);
  const [address, setAddress] = useState("");

  const { addToast } = useToasts();

  const searchForProperties = useCallback(async () => {
    try {
      if (address === "") {
        setSearchedProperties([]);
        return;
      }

      const { properties } = await fetchProperties({
        address: address,
        propertyType: propertyType,
      });

      const propertyDetails = await Promise.all(
        properties.map(async ({ id }) => await fetchPropertyDetails(id))
      );

      setSearchedProperties(
        propertyDetails.reduce((acc, curr) => {
          acc.push(curr.property);
          return acc;
        }, [])
      );
    } catch (e) {
      addToast(e.message, { appearance: "error" });
    }
  }, [addToast, address, propertyType]);

  const handleCheckboxClick = (e, property) => {
    if (e.target.checked) {
      setSelectedProperties([...selectedProperties, property]);
    } else {
      setSelectedProperties(
        selectedProperties.filter(
          (existingProperty) => property.id !== existingProperty.id
        )
      );
    }
  };

  useEffect(() => {
    searchForProperties();
  }, [searchForProperties, address, propertyType]);

  return (
    <div className="App">
      <AppHeader />

      <div className="container">
        <div className={styles.selectedProperties}>
          <div className={styles.sidebarSection}></div>
          <div style={{ flexGrow: 1 }}>
            <SearchBar onSubmit={(searchTerm) => setAddress(searchTerm)} />

            <h3>Selected properties</h3>
            {selectedProperties.length === 0 ? (
              <EmptyState>No selected properties yet</EmptyState>
            ) : (
              <Table>
                <thead>
                  <TableRow>
                    <PropertyTableHeadCells />
                  </TableRow>
                </thead>
                <tbody>
                  {selectedProperties.map((property) => (
                    <TableRow
                      data-testid="property-results-row"
                      key={property.id}
                    >
                      <PropertyRow property={property} />
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>

        <div className={styles.propertyResults}>
          <div className={styles.sidebarSection}>
            <h3>Property Types</h3>
            <PropertyFilter
              currentPropertyType={propertyType}
              onPropertySelect={setCurrentPropertyType}
            />
          </div>
          <div className={styles.resultsTableWrapper}>
            <h3>Search Results</h3>
            {searchedProperties.length === 0 ? (
              <EmptyState>No property results to show</EmptyState>
            ) : (
              <Table>
                <thead>
                  <TableRow>
                    <TableHeadCell>✔</TableHeadCell>
                    <PropertyTableHeadCells />
                  </TableRow>
                </thead>
                <tbody>
                  {searchedProperties.map((property) => (
                    <TableRow
                      data-testid="property-search-row"
                      key={property.id}
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          data-testid="property-checkbox"
                          checked={selectedProperties.includes(property)} // for real world API I would not rely on object equality here, probably try to match IDs
                          onChange={(e) => handleCheckboxClick(e, property)}
                        />
                      </TableCell>
                      <PropertyRow property={property} />
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function App(props) {
  return (
    <ToastProvider autoDismiss={true} autoDismissTimeout={5000}>
      <AppComponent />
    </ToastProvider>
  );
}
