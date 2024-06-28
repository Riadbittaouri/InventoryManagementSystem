import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Context } from "../globalContext/globalContext.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

function AddLabelInfo({ appSettings, onHideModal, isModalVisible, handlingUnit }) {
    const [localHandlingUnit, setLocalHandlingUnit] = useState(handlingUnit || '');
    const [storageLocation, setStorageLocation] = useState('');
    const [storageBin, setStorageBin] = useState('');
    const [materialNumber, setMaterialNumber] = useState('');
    const [quantity, setQuantity] = useState('');
    const [matricule, setMatricule] = useState('');
    const globalContext = useContext(Context);
    const { domain } = globalContext;

    const handlingUnitRef = useRef(null);
    const storageLocationRef = useRef(null);
    const storageBinRef = useRef(null);
    const materialNumberRef = useRef(null);
    const quantityRef = useRef(null);

    useEffect(() => {
        if (isModalVisible && handlingUnitRef.current) {
            handlingUnitRef.current.focus();
        }
    }, [isModalVisible]);

    useEffect(() => {
        const fetchTokenAndDecode = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                if (token) {
                    const decoded = jwtDecode(token);
                    setMatricule(decoded.user_id || decoded.Matricule);
                }
            } catch (error) {
                console.error('Error fetching token:', error);
            }
        };

        fetchTokenAndDecode();
    }, []);

    useEffect(() => {
        if (handlingUnit) {
            setLocalHandlingUnit(handlingUnit); 
        }
    }, [handlingUnit]);

    const handleInputChange = (value, setFunction, targetLength, nextRef) => {
        setFunction(value);
        if (value.length === targetLength && nextRef.current) {
            nextRef.current.focus();
        }
    };

    const createTransaction = async (Storage_Location, Storage_Bin, Material_Number, Quantity) => {
        try {
            console.log("Creating Transaction:", localHandlingUnit);

            const requestBody = {
                HandlingUnit: localHandlingUnit,
                Matricule: matricule,
                storage_location: Storage_Location,
                storage_bin: Storage_Bin,
                material_number: Material_Number,
                Quantity: Quantity,
                message: 'Added Manually',
            };

            console.log("Request Body:", requestBody);

            const response = await fetch(`${domain}/api/v1.0/Transactions/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log("Response:", response);

            if (response.ok) {
                console.log("Transaction created successfully");
            } else {
                const responseData = await response.json();
                console.error("Error response data:", responseData);
                showMessage({
                    message: "Error creating transaction",
                    description: "An error occurred while creating the transaction.",
                    type: "danger",
                });
            }
        } catch (error) {
            console.error("Error during transaction creation:", error);
            Alert.alert("Error", "Failed to create transaction");
        }
    };

    const handleAddLabelInfo = async () => {

        if (!localHandlingUnit) {
            Alert.alert("Error", "Handling Unit is required");
            return;
        }
        if (!storageLocation) {
            Alert.alert("Error", "Storage Location is required");
            return;
        }
        if (!storageBin) {
            Alert.alert("Error", "Storage Bin is required");
            return;
        }
        if (!materialNumber) {
            Alert.alert("Error", "Material Number is required");
            return;
        }
        const parsedQuantity = parseFloat(quantity);
        if (isNaN(parsedQuantity)) {
            Alert.alert("Error", "Quantity must be a valid number");
            return;
        }

        try {
            const labelInfoResponse = await fetch(`${domain}/api/v1.0/Labelinfo/create-labelinfo/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    HandlingUnit: localHandlingUnit,
                    Storage_Location: storageLocation,
                    Storage_Bin: storageBin,
                    Material_Number: materialNumber,
                    Quantity: quantity
                }),
            });

            if (labelInfoResponse.ok) {
                showMessage({
                    message: "Label Info added successfully",
                    type: "success",
                });

                createTransaction(storageLocation, storageBin, materialNumber, quantity);

                if (onHideModal) {
                    onHideModal();
                }
            } else {
                const errorData = await labelInfoResponse.json();
                Alert.alert("Error", errorData.detail || "Failed to add Label Info");
            }
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Error", error.message || "Failed to add Label Info");
        }
    };

    return (
        <View style={styles.addlabelinfocontainer}>
            <Text style={styles.addlabelinfoheading}>Add Label Info</Text>
            <TextInput
                ref={handlingUnitRef}
                value={localHandlingUnit}
                editable={false} // Make the input field read-only
                placeholder="Handling Unit"
                style={[styles.addlabelinfoinput, styles.disabledInput]} // Apply additional styles to indicate it's disabled
            />
            <TextInput
                ref={storageLocationRef}
                value={storageLocation}
                onChangeText={(text) => handleInputChange(text, setStorageLocation, 3, storageBinRef)}
                placeholder="Storage Location"
                style={styles.addlabelinfoinput}
                returnKeyType="next"
            />
            <TextInput
                ref={storageBinRef}
                value={storageBin}
                onChangeText={(text) => handleInputChange(text, setStorageBin, 8, materialNumberRef)}
                placeholder="Storage Bin"
                style={styles.addlabelinfoinput}
                returnKeyType="next"
            />
            <TextInput
                ref={materialNumberRef}
                value={materialNumber}
                onChangeText={(text) => handleInputChange(text, setMaterialNumber, 16, quantityRef)}
                placeholder="Material Number"
                style={styles.addlabelinfoinput}
                returnKeyType="next"
            />
            <TextInput
                ref={quantityRef}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="Quantity"
                style={styles.addlabelinfoinput}
                returnKeyType="done"
            />
            <TouchableOpacity onPress={handleAddLabelInfo} style={styles.addlabelinfobutton}>
                <Text style={styles.addlabelinfobuttonText}>Add Label Info</Text>
            </TouchableOpacity>

            <FlashMessage position="top" />
        </View>
    );
}

const styles = StyleSheet.create({
    addlabelinfocontainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    addlabelinfoheading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    addlabelinfoinput: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    addlabelinfobutton: {
        backgroundColor: '#6e7c85',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    addlabelinfobuttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    disabledInput: {
        backgroundColor: '#f0f0f0', // Light gray background to indicate it's disabled
        color: '#a0a0a0', // Gray text color
    },
});

export default AddLabelInfo;
