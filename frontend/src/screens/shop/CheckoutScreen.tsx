import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/colors';
import { useCart } from '../../contexts/CartContext';
import { shopService } from '../../services/shopService';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CheckoutScreen() {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation<any>();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
  });

  const tax = cartTotal * 0.08;
  const total = cartTotal + tax;

  const handlePlaceOrder = async () => {
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zip) {
      // In a real app, use proper validation
      Alert.alert("Missing Information", "Please fill in all shipping fields.");
      return;
    }

    setLoading(true);
    try {
      const order = await shopService.placeOrder(cartItems, total, shippingInfo);
      setLoading(false);
      setSuccess(true);
      clearCart();
      
      // Navigate back after a short delay
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }], // Assuming Shop is inside MainTabs
        });
      }, 2000);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "There was an issue processing your order. Please try again.");
    }
  };

  if (success) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={60} color="#fff" />
        </View>
        <Text style={[styles.successTitle, { color: theme.text }]}>Order Placed!</Text>
        <Text style={[styles.successDesc, { color: theme.textSecondary }]}>
          Thank you for your purchase. Your order is being processed.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Checkout</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Shipping Information</Text>
            
            <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
              <Ionicons name="person-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Full Name"
                placeholderTextColor={theme.textSecondary}
                value={shippingInfo.name}
                onChangeText={(t) => setShippingInfo({...shippingInfo, name: t})}
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
              <Ionicons name="location-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Address"
                placeholderTextColor={theme.textSecondary}
                value={shippingInfo.address}
                onChangeText={(t) => setShippingInfo({...shippingInfo, address: t})}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.flex1, { backgroundColor: theme.cardBackground, borderColor: theme.border, marginRight: 10 }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="City"
                  placeholderTextColor={theme.textSecondary}
                  value={shippingInfo.city}
                  onChangeText={(t) => setShippingInfo({...shippingInfo, city: t})}
                />
              </View>
              <View style={[styles.inputContainer, styles.flex1, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="ZIP Code"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                  value={shippingInfo.zip}
                  onChangeText={(t) => setShippingInfo({...shippingInfo, zip: t})}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Payment Method</Text>
            <TouchableOpacity style={[styles.paymentMethod, { backgroundColor: theme.cardBackground, borderColor: Colors.primary }]}>
              <Ionicons name="card" size={24} color={Colors.primary} />
              <Text style={[styles.paymentText, { color: theme.text }]}>Credit / Debit Card</Text>
              <Ionicons name="checkmark-circle" size={24} color={Colors.primary} style={styles.checkIcon} />
            </TouchableOpacity>
            {/* Mocked card details */}
            <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border, marginTop: 15 }]}>
              <Ionicons name="card-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Card Number"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Order Summary</Text>
            <View style={[styles.summaryCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Items ({cartItems.length})</Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>${cartTotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Tax</Text>
                <Text style={[styles.summaryValue, { color: theme.text }]}>${tax.toFixed(2)}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.totalLabel, { color: theme.text }]}>Total to Pay</Text>
                <Text style={[styles.totalValue, { color: Colors.primary }]}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </View>

        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.cardBackground, borderTopColor: theme.border }]}>
          <TouchableOpacity 
            style={[styles.placeOrderBtn, { backgroundColor: Colors.primary }]}
            onPress={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.placeOrderText}>Place Order - ${total.toFixed(2)}</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    ...Platform.select({
      ios: {
        shadowColor: Colors.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    marginBottom: 10,
  },
  successDesc: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  paymentText: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    marginLeft: 15,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    ...Platform.select({
      ios: { paddingBottom: 34 },
    })
  },
  placeOrderBtn: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  }
});
