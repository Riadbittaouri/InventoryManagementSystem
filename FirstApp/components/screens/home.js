import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from "../globalContext/globalContext.js";
import FlashMessage, { showMessage } from 'react-native-flash-message';
import containers from '../styles/containers.js';
import fonts from '../styles/fonts.js';
import modals from '../styles/modals.js';
import buttons from '../styles/buttons.js';
import inputs from '../styles/inputs.js';
import AddLabelInfo from './AddLabelInfo';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AntDesign } from '@expo/vector-icons';
import { jwtDecode } from 'jwt-decode';

function Home({ navigation }) {
    const { isLoggedIn, setIsLoggedIn, appSettings, domain } = useContext(Context);
    const [handlingUnit, setHandlingUnit] = useState('');
    const [showAddLabelInfoModal, setShowAddLabelInfoModal] = useState(false);
    const [handlingUnitForModal, setHandlingUnitForModal] = useState('');
    const inputRef = useRef(null);
    const [matricule, setMatricule] = useState('');

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
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (!showAddLabelInfoModal && inputRef.current) {
                inputRef.current.focus();
            }
        });

        return unsubscribe;
    }, [navigation, showAddLabelInfoModal]);

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigation.navigate('Login');
    };

    const createTransaction = async (Storage_Location, Storage_Bin, Material_Number, Quantity) => {
        try {
            console.log("Creating Transaction:", handlingUnit);

            const checkResponse = await fetch(`${domain}/api/v1.0/Transactions/get-transaction/${handlingUnit}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (checkResponse.ok) {
                const checkData = await checkResponse.json();
                if (checkData.message === "Scanned") {
                    showMessage({
                        message: "Already scanned",
                        type: "danger",
                    });
                    return;
                }
            } else if (checkResponse.status === 404) {
                const requestBody = {
                    HandlingUnit: handlingUnit,
                    Matricule: matricule,
                    storage_location: Storage_Location,
                    storage_bin: Storage_Bin,
                    material_number: Material_Number,
                    Quantity: Quantity,
                    message: 'Scanned',
                    location_type: 'WH'
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
            }
        } catch (error) {
            console.error("Error during transaction creation:", error);
            Alert.alert("Error", "Failed to create transaction");
        }
    };

    const handleCancel = () => {
        setShowAddLabelInfoModal(false);
    };

    const onHideModal = () => {
        setShowAddLabelInfoModal(false);
    };

    const handleSearch = async () => {
        console.log("Searching for HandlingUnit:", handlingUnit);

        try {
            const transactionsResponse = await fetch(`${domain}/api/v1.0/Transactions/get-transaction/${handlingUnit}/`);
            const labelInfoResponse = await fetch(`${domain}/api/v1.0/Labelinfo/get-labelinfo/${handlingUnit}/`);

            if (!transactionsResponse.ok && !labelInfoResponse.ok) {
                console.log("Handling unit does not exist in transactions and labelinfo");
                showMessage({
                    message: "Handling unit does not exist",
                    type: "danger",
                });
                setHandlingUnitForModal(handlingUnit);
                setShowAddLabelInfoModal(true);
            } else if (transactionsResponse.ok && labelInfoResponse.ok) {
                const transactionsData = await transactionsResponse.json();
                const labelInfoData = await labelInfoResponse.json();
                showMessage({
                    message: "Already exists in database",
                    type: "info",
                });
                setHandlingUnit("");
                createTransaction(labelInfoData.Storage_Location, labelInfoData.Storage_Bin, labelInfoData.Material_Number, labelInfoData.Quantity);
            } else if (!transactionsResponse.ok && labelInfoResponse.ok) {
                const labelInfoData = await labelInfoResponse.json();
                showMessage({
                    message: "Scanned",
                    type: "success",
                });
                createTransaction(labelInfoData.Storage_Location, labelInfoData.Storage_Bin, labelInfoData.Material_Number, labelInfoData.Quantity);
                setHandlingUnit("");
            }
        } catch (error) {
            console.error("Error during handling unit search:", error);
            Alert.alert("Error", "Failed to search for handling unit");
        }
    };

    useEffect(() => {
        if (handlingUnit.trim().length === 10) {
            handleSearch();
        }
    }, [handlingUnit]);

    const handleModalClose = () => {
        setShowAddLabelInfoModal(false);
        setHandlingUnit('');
    };

    useEffect(() => {
        if (!showAddLabelInfoModal && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showAddLabelInfoModal]);

    return (
        <View style={containers(appSettings).outerPage}>
            <TouchableOpacity style={styles.arrowContainer} onPress={() => navigation.navigate('Menu')}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <View style={containers(appSettings).inputContainer}>
                <TextInput
                    ref={inputRef}
                    style={inputs(appSettings).inputField}
                    placeholder="Enter HandlingUnit number"
                    value={handlingUnit}
                    onChangeText={text => setHandlingUnit(text)}
                />
                <TouchableOpacity
                    style={styles.keyboardIconContainer}
                    onPress={() => inputRef.current && inputRef.current.focus()}
                >
                    <Icon name="keyboard-o" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={fonts(appSettings).logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={showAddLabelInfoModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowAddLabelInfoModal(false)}
            >
                <View style={modals(appSettings).modalContainer}>
                    <View style={modals(appSettings).modalContent}>
                        <AddLabelInfo
                            appSettings={appSettings}
                            onHideModal={handleModalClose}
                            isModalVisible={showAddLabelInfoModal}
                            handlingUnit={handlingUnitForModal}  // Pass the handling unit value for the modal
                        />
                        <TouchableOpacity
                            style={buttons(appSettings).cancelButton}
                            onPress={handleModalClose}>
                            <Text style={buttons(appSettings).buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <FlashMessage position="top" />
        </View>
    );
}
const styles = StyleSheet.create({
    keyboardIconContainer: {
        position: 'absolute',
        right: 10,
        bottom: 45,
    },
    logoutButton: {
        position: 'absolute',
        right: 150,
        bottom: -280,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    arrowContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 1,
    },
});

export default Home;
