import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import constants from "../utils/constans";
import "./Segments.scss"

const Segments = () => {
  const initialDropdown = [
    {
      id: "First Name",
      label: "First Name",
      value: "",
      name: "firstname",
    },
    {
      id: "Last Name",
      label: "Last Name",
      value: "",
      name: "lastname",
    },
    {
      id: "Gender",
      label: "Gender",
      value: "",
      name: "gender",
    },
    {
      id: "Age",
      label: "Age",
      value: "",
      name: "age",
    },
    {
      id: "Account Name",
      label: "Account Name",
      value: "",
      name: "accountName",
    },
    {
      id: "City",
      label: "City",
      value: "",
      name: "city",
    },
    {
      id: "State",
      label: "State",
      value: "",
      name: "state",
    },
  ];

  const [open, setOpen] = useState(false);
  const [selectComponents, setSelectComponents] = useState([]);
  const [dropDownList, setDropDownList] = useState(initialDropdown);
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");

  // backend
  const [backendData, setBackendData] = useState([{}]);
  useEffect(() => {
    fetch("/api").then((response) =>
      response.json().then((data) => {
        setBackendData(data);
      })
    );
  }, []);

  const createValidationSchema = (components) => {
    const schemaFields = components.reduce(
      (acc, component) => {
        acc[component.name] = yup
          .string()
          .required(`${component.label} is required`);
        return acc;
      },
      {
        segmentName: yup.string().required("Segment Name is required"),
      }
    );

    return yup.object().shape(schemaFields);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createValidationSchema(selectComponents)),
  });

  const handleMenuItemClick = (label, name) => {
    const key = selectComponents.length;
    setSelectComponents([
      ...selectComponents,
      {
        key,
        label,
        name,
      },
    ]);
    setDropDownList((prevList) =>
      prevList.filter((item) => item.label !== label)
    );
  };

  const handleRemoveComponent = (key, label) => {
    setSelectComponents((prevComponents) =>
      prevComponents.filter((component) => component.key !== key )
    );
    const itemToAddBack = initialDropdown.find((item) => item.label === label);
    if (itemToAddBack) {
      setDropDownList((prevList) => [...prevList, itemToAddBack]);
    }
  };

  const handleAddClick = () => {
    if (newText) {
      handleMenuItemClick(newText, newText.toLowerCase());
      setNewText("");
      setIsAdding(false);
    }
  };
  

  const handleValues = (e, component) => {
    e.preventDefault();
  };

  const onSubmit = async (data) => {
    console.log("data",data);
    try {
      const response = await fetch('http://localhost:5000/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      // Check if the response status is OK
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Try to parse JSON response
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        // Handle cases where response is not valid JSON
        const text = await response.text();
        throw new Error(`Response is not valid JSON: ${text}`);
      }
  
      console.log(result);
    } catch (error) {
      console.error('Error submitting form data:', error);
    }
  };
  
  

  const handleCancel = () => {
    setOpen(false);
    setSelectComponents([]);
    setDropDownList(initialDropdown);
    setIsAdding(false);
    setNewText("");
    reset();
  };

  return (
    <>
      <Box>
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          {constants.segments}
        </Button>
      </Box>
      <Drawer anchor="right" open={open} onClose={handleCancel}>
        <Box className="segments">
          <Box
            className="form-container"
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              fullWidth
              size="small"
              label="Segment Name"
              placeholder="Name of the Segment"
              {...register("segmentName")}
              error={Boolean(errors?.segmentName)}
              helperText={errors?.segmentName?.message}
            />
            {selectComponents.map((component) => (
              <Box key={component.key} className="selected-component">
                <TextField
                  fullWidth
                  size="small"
                  name={component.name}
                  label={component.label}
                  value={component.value}
                  {...register(component.name, {
                    onChange: (e) => handleValues(e),
                  })}
                  error={Boolean(errors[component.name])}
                  helperText={errors[component.name]?.message}
                />
                <Icon
                  icon="ion:remove"
                  className="remove-icon"
                  onClick={() => {
                    handleRemoveComponent(component.key, component.label);
                  }}
                />
              </Box>
            ))}

            <Box className="select">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  {constants.addSchema}
                </InputLabel>
                <Select
                  fullWidth
                  size="small"
                  labelId="demo-simple-select-label"
                  label="Add schema to segment"
                >
                  {dropDownList.map((item) => (
                    <MenuItem
                      key={item.id}
                      onClick={() => {
                        handleMenuItemClick(item.label, item.name);
                      }}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {isAdding && (
              <Box className="custom-add">
                <TextField
                  size="small"
                  label="Custom schema"
                  value={newText}
                  onChange={(e) => {
                    setNewText(e.target.value);
                  }}
                />
                <Icon
                  icon="material-symbols:add"
                  className="icon-add"
                  onClick={() => {
                    handleAddClick();
                  }}
                />
              </Box>
            )}
            <Typography
              className="new-schema"
              onClick={() => {
                setIsAdding(true);
              }}
            >
              {constants.newSchema}
            </Typography>

            <Box className="submit-buttons">
              <Button variant="contained" size="small" type="submit">
                {constants.save}
              </Button>
              <Button variant="contained" size="small" onClick={handleCancel}>
                {constants.cancel}
              </Button>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Segments;
