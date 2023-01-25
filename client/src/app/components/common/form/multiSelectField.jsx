import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

/*
onChange передаем из родительского registerForm:
const handleChange = (current) => {
        console.log("current", current);
        setData((prevState) => ({
            ...prevState,
            [current.name]: current.value
        }));
    };

current {
    "name": "qualities",
    "value": [
        {
            "label": "Странный",
            "value": "67rdca3eeb7f6fgeed471100"
        }
    ]
}
*/

const MultiSelectField = ({ options, onChange, name, label, defaultValue }) => {
    // для компонента Select нужен МАССИВ options
    // const optionsArray =
    //     !Array.isArray(options) && typeof options === "object"
    //         ? Object.keys(options).map((optionName) => ({
    //               label: options[optionName].name,
    //               value: options[optionName]._id
    //           }))
    //         : options;
    const optionsArray =
        !Array.isArray(options) && typeof options === "object"
            ? Object.values(options)
            : options;
    // console.log(optionsArray);

    const handleChange = (value) => {
        // console.log("value", value);
        // console.log("в мульти", { name: name, value });
        onChange({ name: name, value });
    };
    return (
        <div className="mb-4">
            <label className="form-label">{label}</label>
            <Select
                isMulti
                closeMenuOnSelect={false}
                defaultValue={defaultValue}
                name={name}
                options={optionsArray}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleChange}
            />
        </div>
    );
};

MultiSelectField.propTypes = {
    options: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    onChange: PropTypes.func,
    name: PropTypes.string,
    label: PropTypes.string,
    defaultValue: PropTypes.array
};
export default MultiSelectField;
