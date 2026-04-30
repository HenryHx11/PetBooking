import React, {useState} from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import logo from '../images/petBookingLogo.jpg';
import Iconicons  from 'react-native-vector-icons/Ionicons';
import SQLite, { Transaction } from 'react-native-sqlite-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

SQLite.enablePromise(true);

export default function Home({ route }: any){
    //UserId passed from App.tsx (MainTabs function)
    const userId = route.params?.userId;

    //UI State depending on which form is selected
    const [activeForm, setActiveForm] = useState<'hotel' | 'groom' | 'vet' 
    | null>(null);

    //Form states
    const [petType, setPetType] = useState("");

    //Date states (different types for different forms)
    const [singleDate, setSingleDate] = useState(new Date()); //For groom bookings and appointments
    const [hotelStartDate, setHotelStartDate] = useState(new Date()); //For hotel 
    const [hotelEndDate, setHotelEndDate] = useState(new Date()); //For hotel

    //Controls the date picker popup visibility
    const [showPicker, setShowPicker] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [activeDateField, setActiveDateField] = useState<'single' | 'start' | 'end' | null>(null);

    //Helper function to format date JS date to YYYY-MM-DD
    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };


    //Date picker
    const openPicker = (field: 'single' | 'start' | 'end', mode: 'date' | 'time') => {
        setActiveDateField(field);
        setPickerMode(mode);
        setShowPicker(true);
    };

    const onDateChange = (event: any, selectedDate?: Date) => {
        //Hide the picker immediately after date selection
        if (Platform.OS === 'android'){
            setShowPicker(false);
        }

        if (selectedDate){
            if(activeDateField === 'single'){
                setSingleDate(selectedDate);
            }
            if(activeDateField === 'start'){
                setHotelStartDate(selectedDate);
            }
            if(activeDateField === 'end'){
                setHotelEndDate(selectedDate);
            }
        }
    };

    //Handle form submissions
    const handleBooking = async () => {
        try{
            const db = await SQLite.openDatabase({name: 'db.sqlite', location: 'default', createFromLocation: '~db.sqlite'});

            if(activeForm === 'hotel'){
                if(!hotelStartDate || !hotelEndDate){
                    return Alert.alert("Error", "Please fill in all fields.");
                }
                else if(hotelStartDate >= hotelEndDate){
                    return Alert.alert("Error", "Check-out date must be after check-in date.");
                }
                await db.executeSql(
                    'INSERT INTO hotelBookings (userId, bookDateStart, bookDateEnd) VALUES (?, ?, ?)', 
                    [userId, formatDate(hotelStartDate), formatDate(hotelEndDate)]
                );
            }

            else if(activeForm === 'groom'){
                if(!petType || !singleDate){
                    return Alert.alert("Error", "Please fill in all fields.");
                }
                await db.executeSql(
                    'INSERT INTO groomBookings (userId, petType, bookDate) VALUES (?, ?, ?)',
                    [userId, petType, formatDate(singleDate)]
                );
            }

            else if(activeForm === 'vet'){
                if(!singleDate){
                    return Alert.alert("Error", "Please fill in all fields.");
                }
                await db.executeSql(
                    'INSERT INTO appointments (userId, bookDate) VALUES (?, ?)',
                    [userId, formatDate(singleDate)]
                );
            }

            //Success message and to reset form and active state
            Alert.alert("Success!", "Your booking has been made.");
            setPetType("");
            setActiveForm(null);
        }
        catch(error){
            console.error("Booking error: ", error); //for troubleshoot purpose
            Alert.alert("Error", "An error occurred while making the booking.");
        }
    }
 
  return(
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 100}}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Welcome Back!</Text>
                <Text style={styles.subtitle}>What does your pet need today?</Text>
            </View>

            {/**Service cards */}
            <View style={styles.cardContainer}>
                <TouchableOpacity style={[styles.card, activeForm === 'hotel' && styles.activeCard]}
                onPress={() => setActiveForm('hotel')}>
                    <Iconicons name="business" size={40} color={activeForm === 'hotel' ? '#fff' : '#FF9800'}/>
                    <Text style={[styles.cardText, activeForm === 'hotel' && styles.activeText]}>Pet Hotel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.card, activeForm === 'groom' && styles.activeCard]}
                onPress={() => setActiveForm('groom')}>
                    <Iconicons name="cut" size={40} color={activeForm === 'groom' ? '#fff' : '#e91e63'}/>
                    <Text style={[styles.cardText, activeForm === 'groom' && styles.activeText]}>Grooming</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.card, activeForm === 'vet' && styles.activeCard]}
                onPress={() => setActiveForm('vet')}>
                    <Iconicons name="medkit" size={40} color={activeForm === 'vet' ? '#fff' : '#4caf50'}/>
                    <Text style={[styles.cardText, activeForm === 'vet' && styles.activeText]}>Appointments</Text>
                </TouchableOpacity>
            </View>

            {/**Dynamic forms based on user booking selection*/}
            {activeForm && (
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>
                        {activeForm === 'hotel' ? 'Book a Stay' : activeForm === 'groom' ? 'Schedule Grooming Session' : 'Appointment Booking'}
                    </Text>

                    {/*Hotel form */}
                    {activeForm === 'hotel' && (
                        <>
                        <Text style={styles.label}>Check-In Date</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={() => openPicker('start', 'date')}>
                            <Iconicons name="calendar-outline" size={20} color="#656" style={{ marginRight: 10}}/>
                            <Text style={styles.dateText}>{formatDate(hotelStartDate)}</Text>
                        </TouchableOpacity>

                        <Text style={styles.label}>Check-out</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={() => openPicker('end', 'date')}>
                            <Iconicons name="calendar-outline" size={20} color="#666" style={{ marginRight: 10 }}/>
                            <Text style={styles.dateText}>{formatDate(hotelEndDate)}</Text>
                        </TouchableOpacity>
                        </>
                    )}

                    {/**Grooming Form */}
                    {activeForm === 'groom' && (
                        <>
                        <Text style={styles.label}>Pet Size/Type</Text>
                        <TextInput style={styles.input} placeholder="e.g., Small Dog, Cat" value={petType} onChangeText={setPetType}/>
                        
                        <Text style={styles.label}>Appointment Date</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={() => openPicker('single', 'date')}>
                            <Iconicons name="calendar-outline" size={20} color="#656" style={{marginRight: 10}}/>
                            <Text style={styles.dateText}>{formatDate(singleDate)}</Text>
                        </TouchableOpacity>
                        </>
                    )}

                    {/*Vet Form */}
                    {activeForm === 'vet' && (
                        <>
                        <Text style={styles.label}>Appointment Date</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={() => openPicker('single', 'date')}>
                            <Iconicons name="calendar-outline" size={20} color="#656" style={{marginRight: 10}}/>
                            <Text style={styles.dateText}>{formatDate(singleDate)}</Text>
                         </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity style={styles.submitButton} onPress={handleBooking}>
                        <Text style={styles.submitText}>Confirm Booking</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/*Date picker component */}
            {showPicker && (
                <DateTimePicker
                    value={
                        activeDateField === 'single' ? singleDate :
                        activeDateField === 'start' ? hotelStartDate : hotelEndDate
                    }
                    mode={pickerMode}
                    display="default"
                    onChange={onDateChange}
                    minimumDate={new Date()} //Prevents booking in the past
                />
            )}
        </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    header: {
        marginTop: 20,
        marginBottom: 30
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333'
    },
    subtitle: {
        fontSize: 16,
        color: '#656',
        marginTop: 5
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginHorizontal: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 }
    },
    activeCard: {
        backgroundColor: '#1e90ff'
    },
    cardText: {
        marginTop: 10,
        fontWeight: 'bold',
        color: '#333',
        fontSize: 10.5
    },
    activeText: {
        color: '#fff'
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        elevation: 2
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 5,
        fontWeight: '600'
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16
    },
    submitButton: {
        backgroundColor: '#4caf50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15
    },
    dateText: {
        fontSize: 16,
        color: '#333'
    }
});