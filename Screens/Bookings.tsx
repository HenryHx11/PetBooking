import React, {useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView } from "react-native";
import logo from '../images/petBookingLogo.jpg';
import Iconicons  from 'react-native-vector-icons/Ionicons';
import SQLite, { Transaction } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

interface HotelBooking { hId: number; bookDateStart: string; bookDateEnd: string; }
interface GroomBooking { gId: number; petType: string; bookDate: string; }
interface Appointment { aId: number; bookDate: string; }

export default function Bookings({ route }: any){
    //to pass userId to this screen
    const userId = route.params?.userId;

    const [hotelBookings, setHotelBookings] = useState<HotelBooking[]>([]);
    const [groomBookings, setGroomBookings] = useState<GroomBooking[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

useFocusEffect(
    useCallback(() => {
        const fetchAllBookings = async () => {
            setIsLoading(true);

            try{
                const db = await SQLite.openDatabase({name: 'db.sqlite', location: 'default', createFromLocation: '~db.sqlite'});

                //Fetch all hotel bookings for user using userId
                const [getHotel] = await db.executeSql(
                    'SELECT * FROM hotelBookings WHERE userId = ? ORDER BY bookDateStart ASC', [userId]
                );
                const hotels = [];
                for (let i = 0; i < getHotel.rows.length; i++){
                    //push each hotel booking row into hotels array
                    hotels.push(getHotel.rows.item(i));
                }
                setHotelBookings(hotels); //update state with fetched hotel bookings

                //Fetch all groom bookings for user using userId
                const [getGroom] = await db.executeSql(
                    'SELECT * FROM groomBookings WHERE userId = ? ORDER BY bookDate ASC', [userId]
                );
                const grooms = [];
                for (let i = 0; i < getGroom.rows.length; i++){
                    //push each groom booking row into grooms
                    grooms.push(getGroom.rows.item(i));
                }
                setGroomBookings(grooms); //update state with fetched groom bookings

                //Fetch all appointments for user using userId
                const [getAppointments] = await db.executeSql(
                    'SELECT * FROM appointments WHERE userId = ? ORDER BY bookDate ASC', [userId]
                );
                const appointments = [];
                for (let i = 0; i < getAppointments.rows.length; i++){
                    //push each appointment row into appointments
                    appointments.push(getAppointments.rows.item(i));
                }
                setAppointments(appointments); //update state with fetched appointments
            }
            catch (error){
                console.error("Error fetching bookings: ", error);
            } finally {
                setIsLoading(false); //Set loading to false after all fetches are done (success or error)
            }
        };

        fetchAllBookings();
    }, [userId]) //To rerun this code whenever userId is changed. i.e. different user
);

if(isLoading){
    return <ActivityIndicator size="large" color="#1e90ff" style={styles.loader} />;
}

return(
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 100}}>
        <Text style={styles.pageTitle}>My Bookings</Text>

        {/**First section: Hotel Bookings */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Iconicons name="business" size={24} color="#ff9000"/>
                <Text style={styles.sectionTitle}>Hotel Bookings</Text>
            </View>
            {hotelBookings.length === 0 ? (
                <Text style={styles.emptyText}>No hotel bookings.</Text>
            ) : (
                hotelBookings.map((b) => (
                    <View key={'hotel-${b.hId}'} style={styles.card}>
                        <Text style={styles.cardText}><Text style={styles.bold}>Check-In: </Text> {b.bookDateStart}</Text>
                        <Text style={styles.cardText}><Text style={styles.bold}>Check-Out: </Text> {b.bookDateEnd}</Text>
                    </View>
                ))
            )}
        </View>
        {/**End hotel bookings section */}
        
        {/**Pet Grooming Book Section */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Iconicons name="cut" size={24} color="#e91e63"/>
                <Text style={styles.sectionTitle}>Grooming</Text>
            </View>
            {groomBookings.length === 0 ? (
                <Text style={styles.emptyText}>No upcoming grooming sessions.</Text>
            ) : (
                groomBookings.map((g) => (
                    <View key={'groom-${b.gId}'} style={styles.card}>
                        <Text style={styles.cardText}><Text style={styles.bold}>Pet: </Text> {g.petType}</Text>
                        <Text style={styles.cardText}><Text style={styles.bold}>Date: </Text> {g.bookDate}</Text>
                    </View>
                ))
            )}
        </View>
        {/**End grooming section */}

        {/**Appointment booking section */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Iconicons name="medkit" size={24} color="#4caf50"/>
                <Text style={styles.sectionTitle}>Appointments</Text>
            </View>
            {appointments.length === 0 ? (
                <Text style={styles.emptyText}>No upcoming appointments.</Text>
            ) : (
                appointments.map((a) => (
                    <View key={'appointment-${a.id}'} style={styles.card}>
                        <Text style={styles.cardText}><Text style={styles.bold}>Date: </Text> {a.bookDate}</Text>
                    </View>
                ))
            )}
        </View>

    </ScrollView>
)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
        padding: 15,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        marginTop: 10,
    },
    section: {
        marginBottom: 25,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        elevation: 2,
        shadowColor: '#000000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2},
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    cardText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 4,
    },
    bold: {
        fontWeight: 'bold',
        color: '#333',
    },
    emptyText: {
        color: '#888',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 10,
    }
});