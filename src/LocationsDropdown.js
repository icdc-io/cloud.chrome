import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import './wrapper.scss';
import PropTypes from 'prop-types';

const LocationsDropdown = ({
  location,
  currentAccountInfo,
  serviceAvailability,
  changeUserInfo
}) => {
    const getLocationsAvailability = (locations, serviceAvailability) => {
        const availableLocations = [], notAvailableLocations = [];

        for (const loc of locations) {
            if (serviceAvailability[loc]) {
                availableLocations.push({
                    key: loc,
                    text: loc,
                    value: loc
                });
            } else {
                notAvailableLocations.push({
                    key: loc,
                    text: loc,
                    value: loc,
                    disabled: true
                });
            }
        }

        return { availableLocations, notAvailableLocations };
    };

    const { availableLocations, notAvailableLocations } = getLocationsAvailability(currentAccountInfo.locations, serviceAvailability);

    return (
      <label>
          Location:
          <Dropdown fluid
              selection
              value={location}
              options={[...availableLocations, ...notAvailableLocations]}
              scrolling={false}
              className='locations'
          >
              <Dropdown.Menu>
                  { availableLocations.map(currentLocation => (
                      <Dropdown.Item key={currentLocation.key}
                          className={(currentLocation.value === location ? 'current' : '') + ' available'}
                          onClick={() => changeUserInfo(currentLocation.value)}
                          active={currentLocation.value === location}
                          selected={currentLocation.value === location}
                      >
                          {currentLocation.text}
                      </Dropdown.Item>
                  ))}
                  <Dropdown.Divider />
                  { notAvailableLocations.map(currentLocation => (
                      <Dropdown.Item key={currentLocation.key}
                          onClick={() => changeUserInfo(currentLocation.value)}
                          active={currentLocation.value === location}
                          selected={currentLocation.value === location}
                      >
                          {currentLocation.text}
                      </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
          </Dropdown>
      </label>
    );
};

LocationsDropdown.propTypes = {
    id: PropTypes.string,
    changeAccounts: PropTypes.func,
    routes: PropTypes.array,
    locale: PropTypes.string,
    changeLang: PropTypes.func
};

export default LocationsDropdown;
