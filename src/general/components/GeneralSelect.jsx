import { Combobox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import PropTypes from "prop-types";
import * as React from "react";
import { Fragment, useState } from "react";
import styles from "../styles/GeneralSelect.module.css";

const GeneralSelect = React.forwardRef(
  (
    { value, onChange, options, name = "", label, triggerClassName = "" },
    forwardedRef,
  ) => {
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState(
      options.find((option) => option.value === value) || "",
    );
    const filteredOptions =
      query === ""
        ? options
        : options.filter((option) =>
            option.text
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, "")),
          );

    const changeSelectedOption = (newOption) => {
      onChange({ name, value: newOption.value });
      setSelected(newOption);
    };

    return (
      <div className={styles["select-container"]}>
        <Combobox
          value={selected}
          onChange={changeSelectedOption}
          className={styles["select-root"]}
        >
          <div className={styles["select-content-container"]}>
            <div className={styles["trigger-container"]}>
              <Combobox.Input
                className={`${styles["select-input"]} ${triggerClassName}`}
                displayValue={(option) => option.text}
                onChange={(event) => setQuery(event.target.value)}
                aria-label={label}
                id={name}
                ref={forwardedRef}
              />
              <Combobox.Button className={styles["trigger-arrow"]}>
                <ChevronDownIcon />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className={styles["select-options"]}>
                {filteredOptions.length === 0 && query !== "" ? (
                  <div className={styles["select-empty"]}>Nothing found.</div>
                ) : (
                  filteredOptions.map((option, key) => (
                    <Combobox.Option
                      key={key}
                      className={({ active, selected }) =>
                        `${styles["select-item"]} ${
                          active ? styles["active-item"] : ""
                        } ${selected ? styles["selected-item"] : ""}`
                      }
                      value={option}
                    >
                      {({ selected }) => (
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {option.text}
                        </span>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    );
  },
);

GeneralSelect.displayName = "GeneralSelect";

GeneralSelect.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  label: PropTypes.string,
  triggerClassName: PropTypes.string,
};

export default GeneralSelect;
