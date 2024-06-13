import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faUsers, faPhone, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import firestore from '@react-native-firebase/firestore';

const Comptes = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = await firestore().collection('Users').get();
        const usersData = usersCollection.docs.map(doc => doc.data());
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []); 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mon compte</Text>
        <Text style={styles.subtitle}>Votre santé. Vos données.</Text>
      </View>
      <View style={styles.separator} />
      {users.map(user => (
        <TouchableOpacity key={user.id} style={styles.item}>
          <FontAwesomeIcon icon={faUser} size={16} color="#187ecc" style={styles.itemIcon} />
          <View style={styles.itemContent}>
            <Text style={styles.itemText}>Mon profil</Text>
            <Text style={styles.itemSubtext}>{user.name}</Text>
          </View>
          <FontAwesomeIcon icon={faChevronRight} size={16} color="#6c757d" style={styles.itemArrow} />
        </TouchableOpacity>
      ))}
      <View style={styles.separator} />
      <TouchableOpacity style={styles.item}>
        <FontAwesomeIcon icon={faUsers} size={16} color="#187ecc" style={styles.itemIcon} />
        <View style={styles.itemContent}>
          <Text style={styles.itemText}>Mes proches</Text>
          <Text style={styles.itemSubtext}>Ajoutez et gérez les profils de vos proches</Text>
        </View>
        <FontAwesomeIcon icon={faChevronRight} size={16} color="#6c757d" style={styles.itemArrow} />
      </TouchableOpacity>
      <View style={styles.separator} />
      <TouchableOpacity style={styles.item}>
        <FontAwesomeIcon icon={faPhone} size={16} color="#187ecc" style={styles.itemIcon} />
        <View style={styles.itemContent}>
          <Text style={styles.itemText}>Téléphone</Text>
          <Text style={styles.itemSubtext}>06 11 77 12 50</Text>
          <Text style={styles.itemVerified}>Vérifié</Text>
        </View>
        <FontAwesomeIcon icon={faChevronRight} size={16} color="#6c757d" style={styles.itemArrow} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  separator: {
    height: 1,
    backgroundColor: '#f2f2f2',
    marginVertical: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  itemIcon: {
    marginRight: 20,
  },
  itemContent: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemSubtext: {
    fontSize: 14,
    color: '#6c757d',
  },
  itemVerified: {
    fontSize: 12,
    color: '#28a745',
  },
  itemArrow: {
    marginLeft: 10,
  },
});

export default Comptes;
