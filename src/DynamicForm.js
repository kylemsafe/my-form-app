import React, { useState } from 'react';
import formStructure from './formStructure.json'; // Adjust the path if needed

const DynamicForm = () => {
    const [formData, setFormData] = useState({});

    const handleChange = (event, path) => {
        const { value } = event.target;
        setFormData(prevState => {
            const newState = { ...prevState };
            const keys = path.split('.');
            keys.reduce((current, key, index) => {
                if (index === keys.length - 1) {
                    current[key] = value;
                } else {
                    current[key] = current[key] || {};
                }
                return current[key];
            }, newState);
            return newState;
        });
    };    

    const renderDropdown = (path, options) => {
        return (
            <select 
                name={path} 
                value={formData[path] || ''} 
                onChange={(e) => handleChange(e, path)}
            >
                {options.map((option, index) => (
                    <option key={`${path}-${index}`} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        );
    };

    const renderFormFields = (data, parentPath = '') => {
        return Object.entries(data).map(([key, value]) => {
            const path = parentPath ? `${parentPath}.${key}` : key;

            if (value === null) {
                return (
                    <div key={path}>
                        <label>{key.replace(/\.\d+/g, '')}:</label>
                        <input 
                            type="text" 
                            name={path} 
                            value={formData[path] || ''} 
                            onChange={(e) => handleChange(e, path)} 
                        />
                    </div>
                );
            } else if (Array.isArray(value) && value.every(item => typeof item !== 'object')) {
                // Render dropdown if the array doesn't contain objects
                return (
                    <div key={path}>
                        <label>{key}:</label>
                        {renderDropdown(path, value)}
                    </div>
                );
            } else if (Array.isArray(value) || typeof value === 'object') {
                return (
                    <fieldset key={path}>
                        <legend>{key}</legend>
                        {renderFormFields(value, path)}
                    </fieldset>
                );
            }
            return null;
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData); // Handle form data as needed
    };

    return (
        <form onSubmit={handleSubmit}>
            {renderFormFields(formStructure)}
            <button type="submit">Submit</button>
        </form>
    );
};

export default DynamicForm;
