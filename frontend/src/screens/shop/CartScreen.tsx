import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/colors';
import { useCart } from '../../contexts/CartContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation<any>();
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  const tax = cartTotal * 0.08; // 8% mock tax
  const total = cartTotal + tax;

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={[styles.cartItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={[styles.itemTitle, { color: theme.text }]} numberOfLines={2}>
          {item.product.title}
        </Text>
        
        <View style={styles.variantsRow}>
          {item.selectedSize && (
            <Text style={[styles.variantText, { color: theme.textSecondary }]}>Size: {item.selectedSize}</Text>
          )}
          {item.selectedColor && (
            <Text style={[styles.variantText, { color: theme.textSecondary }]}>Color: {item.selectedColor}</Text>
          )}
        </View>

        <Text style={[styles.itemPrice, { color: Colors.primary }]}>
          ${(item.product.price * item.quantity).toFixed(2)}
        </Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[styles.qtyBtn, { backgroundColor: theme.background, borderColor: theme.border }]}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.qtyText, { color: theme.text }]}>{item.quantity}</Text>
          <TouchableOpacity 
            style={[styles.qtyBtn, { backgroundColor: theme.background, borderColor: theme.border }]}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.deleteBtn}
        onPress={() => removeFromCart(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color={Colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Cart</Text>
        <View style={{ width: 44 }} /> {/* Spacer */}
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={theme.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Your cart is empty</Text>
          <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
            Looks like you haven't added any items to the cart yet.
          </Text>
          <TouchableOpacity 
            style={[styles.shopBtn, { backgroundColor: Colors.primary }]}
            onPress={() => navigation.navigate('Shop')}
          >
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={[styles.summaryContainer, { backgroundColor: theme.cardBackground, borderTopColor: theme.border }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Subtotal</Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>${cartTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>Tax (8%)</Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
              <Text style={[styles.totalValue, { color: Colors.primary }]}>${total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.checkoutBtn, { backgroundColor: Colors.primary }]}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyDesc: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  shopBtn: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
  },
  shopBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 15,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
  },
  variantsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  variantText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  qtyText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginHorizontal: 12,
  },
  deleteBtn: {
    padding: 8,
    justifyContent: 'flex-start',
  },
  summaryContainer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  totalValue: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 20,
    gap: 10,
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  }
});
