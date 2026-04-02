import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ScrollView } from "react-native";
import logo from '../images/petBookingLogo.jpg';
import Icon  from 'react-native-vector-icons/Ionicons';
import SQLite, { Transaction } from 'react-native-sqlite-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import defaultAvatar from '../images/petBookingLogo.jpg'; //original logo as default profile pic

SQLite.enablePromise(true);

export default function Profile({ route, navigation }: any){

    //grab ID passed from Login
    const userId = route.params?.userId;

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        console.log("Current userId passed to Profile:", userId);
  
  if (!userId) {
    console.warn("No userId provided! Defaulting to empty fields.");
    return;
  }
        const fetchUser = async () => {
            const db = await SQLite.openDatabase({name: 'db.sqlite', location: 'default', createFromLocation : '~db.sqlite'});

            const [results] = await db.executeSql(
                'SELECT username, email, profile_pic FROM users WHERE id = ?',
                [userId] 
            );

            console.log("Rows found in DB:", results.rows.length); // <-- IF THIS IS 0, THAT'S THE PROBLEM

            if(results.rows.length > 0){
                const user = results.rows.item(0);
                setUsername(user.username);
                setEmail(user.email);
                setProfilePic(user.profile_pic);
            }
        };
        fetchUser();
    }, [userId]);

    //Change Image function
    const pickImage = () => {
        if(!isEditing){
            return; //Only allow picking image if in Edit Mode
        }
        launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
            if(response.assets && response.assets[0].uri){
                setProfilePic(response.assets[0].uri);
            }
        });
    };

    const handleSave = async () => {
        const db = await SQLite.openDatabase({name: 'db.sqlite', location: 'default', createFromLocation : '~db.sqlite'});

        //Update user info
        await db.executeSql(
            'UPDATE users SET username = ?, email = ?, profile_pic = ? WHERE id = ?',
            [username, email, profilePic, userId]
        );

        Alert.alert("Success", "Profile information has been updated!");
        setIsEditing(false);
    };

  return(
    <ScrollView contentContainerStyle = {styles.container}>
        {/*Profile Header*/}
        <View style={styles.header}>
            <TouchableOpacity onPress={pickImage} disabled={!isEditing}>
                <Image
                    source={profilePic ? {uri: profilePic} : defaultAvatar}
                    style={[styles.avatar, isEditing && styles.editingAvatar]}
                />
                {isEditing && (
                    <View style={styles.cameraOverlay}>
                        <Icon name="camera" size={24} color="#fff" />
                    </View>
                )}
            </TouchableOpacity>
            <Text style={styles.displayName}>{username || "User"}</Text>
        </View>

        {/*Form Fields*/}
        <View style={styles.form}>
            <Text style={styles.label}>Username</Text>
            <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={username}
                onChangeText={setUsername}
                editable={isEditing}
                placeholder="Enter your new username"
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
                style={[styles.input, !isEditing && styles.disabledInput]}
                value={email}
                onChangeText={setEmail}
                editable={isEditing}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
            />
        </View>

        {/**Action Buttons*/}
        <View style={styles.footer}>
            {!isEditing ? (
                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <Icon name="create-outline" size={20} color="#fff" style={{marginRight: 8}}/>
                <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.editActions}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditing(false)}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.buttonText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0'
    },
    editingAvatar: {
        opacity: 0.7,
        borderWidth: 60, 
        backgroundColor: '#f0f0f0',
    },
    cameraOverlay:{
        position: 'absolute',
        top: 40,
        left: 45
    },
    displayName:{
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 15,
        color: '#333',
    },
    form: {
        width: '100%'
    },
    label: {
        color: '#888',
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '600'
    },
    input: {
        width: '100%',
        height: 50, 
        backgroundColor: '#f9f9f9', 
        borderRadius: 10, 
        paddingHorizontal: 15, 
        fontSize: 16, 
        color: '#333',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee'
    },
    disabledInput: {
        backgroundColor: '#fff',
        borderColor: 'transparent',
        color: '#666',
    },
    footer: {
        marginTop: 20
    },
    editButton: {
        backgroundColor: '#1e90ff',
        flexDirection: 'row', 
        height: 50, 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    saveButton: { 
        backgroundColor: '#4CAF50', 
        height: 50, borderRadius: 10, 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    cancelButton: { 
        height: 50, 
        borderRadius: 10, 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 10 
    },
    editActions: { 
        flexDirection: 'row' 
    },
    buttonText: { 
        color: '#fff',
        fontSize: 16, 
        fontWeight: 'bold' 
    },
    cancelText: { 
        color: '#ff4444', 
        fontSize: 16 
    }
});