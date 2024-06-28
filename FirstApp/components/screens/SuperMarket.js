import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { showMessage } from 'react-native-flash-message';
import { Context } from "../globalContext/globalContext.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import AddLabelInfo from './AddLabelInfo';

function SuperMarket({ navigation }) {
    const { domain } = useContext(Context);

    const [storageBin, setStorageBin] = useState('');
    const [handlingUnit, setHandlingUnit] = useState('');
    const [quantity, setQuantity] = useState('');
    const [materialNumber, setMaterialNumber] = useState('');
    const [storageLocation, setStorageLocation] = useState('');
    const [matricule, setMatricule] = useState('');
    const [labelInfoData, setLabelInfoData] = useState(null);
    const [isQuantityEditable, setIsQuantityEditable] = useState(false);
    const [isHandlingUnitEditable, setIsHandlingUnitEditable] = useState(true);
    const [isHandlingUnitFocused, setIsHandlingUnitFocused] = useState(false);
    const [isQuantityFocused, setIsQuantityFocused] = useState(false);
    const [isStorageBinFocused, setIsStorageBinFocused] = useState(false);
    const [isStorageBinEditable, setIsStorageBinEditable] = useState(true);
    const [isNextBinEnabled, setIsNextBinEnabled] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showAddLabelInfoModal, setShowAddLabelInfoModal] = useState(false);
    const [position, setPosition] = useState('');
    const [modalHandlingUnit, setModalHandlingUnit] = useState('');
    const [modalQuantity, setModalQuantity] = useState('');
    const [transactionMessage, setTransactionMessage] = useState('');
    const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);
    const storageBinRef = useRef(null);
    const handlingUnitRef = useRef(null);
    const quantityRef = useRef(null);

    useEffect(() => {
        const fetchTokenAndDecode = async () => {
            const token = await AsyncStorage.getItem('accessToken');
            if (token) {
                const decoded = jwtDecode(token);
                setMatricule(decoded.user_id || decoded.Matricule);
            }
        };

        fetchTokenAndDecode();
    }, []);

    useEffect(() => {
        if (storageBinRef.current) {
            storageBinRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (storageBin.length === 8 && handlingUnitRef.current) {
            handlingUnitRef.current.focus();
            setIsHandlingUnitFocused(true);
            setIsStorageBinEditable(false);
        } else {
            setIsHandlingUnitFocused(false);
        }
    }, [storageBin]);

    useEffect(() => {
        if (handlingUnit.length === 8) {
            checkIfAlreadyScanned(handlingUnit);
        }
    }, [handlingUnit]);

    useEffect(() => {
        if (handlingUnit.length === 10) {
            checkHandlingUnitExists();
        }
    }, [handlingUnit]);

    useEffect(() => {
        if (modalVisible) {
            setPosition(storageBin);
            setModalHandlingUnit(handlingUnit);
            setModalQuantity(quantity);
        }
    }, [modalVisible]);

    useEffect(() => {
        if (/^\d{1,6}$/.test(modalQuantity)) {
            setIsConfirmDisabled(false);
        } else {
            setIsConfirmDisabled(true);
        }
    }, [modalQuantity]);

    const checkHandlingUnitExists = async () => {
        try {
            const labelInfoUrl = `${domain}/api/v1.0/Labelinfo/get-labelinfo/${handlingUnit}/`;
            const labelInfoResponse = await fetch(labelInfoUrl);

            if (labelInfoResponse.status === 404) {
                showMessage({
                    message: "Handling unit does not exist",
                    type: "danger",
                    zIndex: 9999
                });
                setShowAddLabelInfoModal(true);
            } else {
                fetchData();
            }
        } catch (error) {
            console.error('Error checking handling unit existence:', error);
            showMessage({
                message: "Failed to check handling unit existence: " + (error.message || "Unknown error"),
                type: "danger",
                zIndex: 9999
            });
        }
    };

    const fetchData = async () => {
        try {
            const labelInfoUrl = `${domain}/api/v1.0/Labelinfo/get-labelinfo/${handlingUnit}/${storageBin}/`;
            const labelInfoResponse = await fetch(labelInfoUrl);
            const labelInfoData = await labelInfoResponse.json();

            if ("error" in labelInfoData) {
                showMessage({
                    message: "Wrong position",
                    type: "danger",
                    zIndex: 9999
                });
                setModalVisible(true);
            } else {
                setStorageLocation(labelInfoData.storage_location);
                setMaterialNumber(labelInfoData.material_number);

                if (labelInfoData.Quantity) {
                    setQuantity(labelInfoData.Quantity);
                    setIsQuantityEditable(true);
                } else {
                    showMessage({
                        message: "Quantity data not available",
                        type: "danger",
                        zIndex: 9999
                    });
                    setIsQuantityEditable(false);
                }

                setIsHandlingUnitEditable(false);
                quantityRef.current && quantityRef.current.focus();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            showMessage({
                message: "Failed to fetch data: " + (error.message || "Unknown error"),
                type: "danger",
                zIndex: 9999
            });
        }
    };

    const checkIfAlreadyScanned = async (handlingUnit) => {
        try {
            const url = `${domain}/api/v1.0/Transactions/get-transaction/${handlingUnit}/`;
            const checkResponse = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (checkResponse.ok) {
                const checkData = await checkResponse.json();
                if (
                    checkData.message === "Scanned" ||
                    checkData.message === "Position Changed" ||
                    checkData.message === "Quantity Changed"
                ) {
                    setModalVisible(false);
                    showMessage({
                        message: "Already Scanned",
                        type: "danger",
                        icon: "danger",
                        duration: 3000,
                    });

                    setHandlingUnit("");
                    setQuantity("");
                    setIsHandlingUnitFocused(true);
                    setIsHandlingUnitEditable(true);
                    setIsQuantityEditable(false);
                    if (handlingUnitRef.current) {
                        handlingUnitRef.current.focus();
                    }
                    return true;
                }
            } else if (checkResponse.status === 404) {
                return false;
            } else {
                const responseText = await checkResponse.text();
                console.error(`Error response: ${responseText}`);
            }
        } catch (error) {
            console.error("Error during check if already scanned:", error);
        }
        return false;
    };

    const confirmPositionChange = async () => {
        try {
            const labelInfoUrl = `${domain}/api/v1.0/Labelinfo/get-labelinfo/${handlingUnit}/`;
            const labelInfoResponse = await fetch(labelInfoUrl);
            const labelInfoData = await labelInfoResponse.json();
    
            if (labelInfoData) {
                const quantityMatch = labelInfoData.Quantity === modalQuantity;
                const positionMatch = labelInfoData.Storage_Bin === position;
    
                if (quantityMatch && positionMatch) {
                    createNewTransaction("Position Not Changed", modalHandlingUnit, position, modalQuantity);

                } else if (!quantityMatch && positionMatch) {
                    createNewTransaction("Quantity Changed", modalHandlingUnit, position, modalQuantity);
                } else {
                    createNewTransaction("Position Changed", modalHandlingUnit, position, modalQuantity);
                }
                setHandlingUnit("");
                setQuantity("");
                setModalVisible(false);
                setTimeout(() => {
                    setIsHandlingUnitEditable(true);
                    setIsHandlingUnitFocused(true);
                }, 400);
            }
        } catch (error) {
            console.error('Error while creating transaction:', error);
            showMessage({ message: "Error", description: "Failed to create transaction", type: "danger" });
        }
    };
    
    const createNewTransaction = async (message, handlingUnitValue, positionValue, quantityValue) => {
        try {
            const alreadyScanned = await checkIfAlreadyScanned(handlingUnit);
            if (alreadyScanned) return;

            const labelInfoUrl = `${domain}/api/v1.0/Labelinfo/get-labelinfo/${handlingUnitValue}/`;
            const labelInfoResponse = await fetch(labelInfoUrl);
            const labelInfoData3 = await labelInfoResponse.json();

            if (labelInfoData3 && labelInfoData3.Quantity !== undefined) {
                const quantityMatch = labelInfoData3.Quantity === quantityValue;
                const transactionMessage = quantityMatch ? message : 'Quantity Changed';
                const storageBinValue = message === 'Position Changed' ? positionValue : labelInfoData3.Storage_Bin;

                const requestBody = {                    HandlingUnit: handlingUnitValue,
                    Matricule: matricule,
                    storage_bin: storageBinValue,
                    storage_location: labelInfoData3.Storage_Location,
                    material_number: labelInfoData3.Material_Number,
                    Quantity: quantityValue,
                    message: transactionMessage,
                    location_type: 'SM',
                };

                const response = await fetch(`${domain}/api/v1.0/Transactions/create/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    showMessage({
                        message: transactionMessage,
                        type: "success",
                    });
                } else {
                    const responseText = await response.text();
                    console.error("Error response data:", responseText);
                    showMessage({
                        message: "Error creating transaction",
                        description: "An error occurred while creating the transaction.",
                        type: "danger",
                    });
                }
            } else {
                console.error('Error: Label info data not available or missing Quantity property');
                showMessage({
                    message: "Error creating transaction",
                    description: "Label info data not available or missing Quantity property.",
                    type: "danger",
                });
            }
        } catch (error) {
            console.error('Error creating transaction:', error);
            showMessage({
                message: "Failed to create transaction",
                type: "danger",
            });
        }
    };

    const handleNextHandlingUnit = async () => {
        try {
            const alreadyScanned = await checkIfAlreadyScanned(handlingUnit);
            if (alreadyScanned) return;

            const labelInfoUrl = `${domain}/api/v1.0/Labelinfo/get-labelinfo/${handlingUnit}/`;
            const labelInfoResponse = await fetch(labelInfoUrl);
            const labelInfoData = await labelInfoResponse.json();
            if (labelInfoData && labelInfoData.Quantity !== undefined) {
                if (quantity !== labelInfoData.Quantity) {
                    showMessage({
                        message: "Quantity Changed",
                        type: "success",
                    });
                    createNewTransaction("Quantity Changed", handlingUnit, storageBin, quantity);
                } else if (storageBin !== labelInfoData.Storage_Bin) {
                    showMessage({
                        message: "Position Changed",
                        type: "success",
                    });
                    createNewTransaction("Position Changed", handlingUnit, storageBin, quantity);
                } else {
                    showMessage({
                        message: "Scanned",
                        type: "success",
                    });
                    createNewTransaction("Scanned", handlingUnit, storageBin, quantity);
                }
            } else {
                console.error('Error: Label info data not available or missing Quantity property');
                showMessage({
                    message: "Error fetching quantity",
                    description: "Label info data not available or missing Quantity property.",
                    type: "danger",
                });
            }

            setHandlingUnit("");
            setQuantity("");
            setIsHandlingUnitEditable(true);
            setIsHandlingUnitFocused(true);
            setIsQuantityEditable(false);
            if (handlingUnitRef.current) {
                handlingUnitRef.current.focus();
            }
        } catch (error) {
            console.error('Error handling next handling unit:', error);
            showMessage({
                message: "Error",
                description: "Failed to handle next handling unit",
                type: "danger",
            });
        }
    };

    const handleNextStorageBin = () => {
        setStorageBin("");
        setHandlingUnit("");
        setQuantity(""); // Reset quantity
        setIsHandlingUnitEditable(true);
        setIsQuantityEditable(false);
        setIsStorageBinEditable(true); // Re-enable Storage Bin field for next input
        storageBinRef.current && storageBinRef.current.focus();
    };

    const handleEditPosition = () => {
        setModalVisible(true);
        setPosition(handlingUnit);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setQuantity("");
        setHandlingUnit("");
    };

    const handleHandlingUnitFocus = () => {
        setIsHandlingUnitFocused(true);
        setIsNextBinEnabled(true); // Enable Next Bin button
        setIsQuantityFocused(false);
        setIsStorageBinFocused(false);
        setIsStorageBinEditable(false); // Disable Storage Bin field when Handling Unit is focused
    };

    const handleQuantityFocus = () => {
        setIsHandlingUnitFocused(false);
        setIsNextBinEnabled(false); // Disable Next Bin button
        setIsQuantityFocused(true);
        setIsStorageBinFocused(false);
    };

    const handleStorageBinFocus = () => {
        setIsHandlingUnitFocused(false);
        setIsNextBinEnabled(false); // Disable Next Bin button
        setIsQuantityFocused(false);
        setIsStorageBinFocused(true);
    };

    const handleModalClose = () => {
        setShowAddLabelInfoModal(false);
        setHandlingUnit('');
        if (handlingUnitRef.current) {
            handlingUnitRef.current.focus();
        }
    };

    const handleModalQuantityChange = (text) => {
        if (/^\d{0,6}$/.test(text)) {
            setModalQuantity(text);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.text}>Super Market Page</Text>
            <TextInput
                ref={storageBinRef}
                style={styles.input}
                placeholder="Storage Bin"
                value={storageBin}
                onChangeText={text => setStorageBin(text)}
                onFocus={handleStorageBinFocus}
                editable={isStorageBinEditable}
                autoCapitalize="none"
            />
            <TextInput
                ref={handlingUnitRef}
                style={styles.input}
                placeholder="Handling Unit"
                value={handlingUnit}
                onChangeText={text => setHandlingUnit(text)}
                onFocus={handleHandlingUnitFocus}
                onBlur={async () => {
                    if (handlingUnit.length === 8) {
                        await checkIfAlreadyScanned(handlingUnit);
                    }
                }}
                editable={isHandlingUnitEditable}
                autoCapitalize="none"
            />

            <TextInput
                ref={quantityRef}
                style={styles.input}
                placeholder="Quantity"
                value={quantity}
                onChangeText={text => setQuantity(text)}
                onFocus={handleQuantityFocus}
                editable={isQuantityEditable}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        (isHandlingUnitFocused || isStorageBinFocused || !quantity) ? styles.disabledButton : styles.enabledButton,
                    ]}
                    onPress={handleNextHandlingUnit}
                    disabled={isHandlingUnitFocused || isStorageBinFocused || !quantity}
                >
                    <Text style={styles.buttonText}>Next Handling Unit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        isNextBinEnabled ? styles.enabledButton : styles.disabledButton, // Control Next Bin button enable/disable status
                    ]}
                    onPress={handleNextStorageBin}
                    disabled={!isNextBinEnabled} // Disable Next Bin button when not needed
                >
                    <Text style={styles.buttonText}>Next Bin</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Position</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="New Position"
                            value={position}
                            onChangeText={text => setPosition(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Handling Unit"
                            value={modalHandlingUnit}
                            editable={false} // Grayed out input field
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Quantity"
                            value={modalQuantity}
                            onChangeText={handleModalQuantityChange}
                        />
                        <View style={styles.modalActions}>
                            <Button title="Confirm" onPress={confirmPositionChange} disabled={isConfirmDisabled} />
                            <Button title="Cancel" color="red" onPress={handleCancel} />
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={showAddLabelInfoModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddLabelInfoModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <AddLabelInfo
                            onHideModal={handleModalClose}
                            handlingUnit={handlingUnit}
                        />
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleModalClose}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        width: '48%',
    },
    disabledButton: {
        backgroundColor: '#d3d3d3',
    },
    enabledButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: 'red',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        width: '48%',
        alignItems: 'center',
        marginTop: 20,
    }
});

export default SuperMarket;

                   
