import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { Colors } from '../../theme/colors';
import { shopService } from '../../services/shopService';
import { Product } from '../../types/shop';
import { useCart } from '../../contexts/CartContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const { addToCart } = useCart();
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      const data = await shopService.fetchProductById(productId);
      if (data) {
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
      }
      setLoading(false);
    };
    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1, selectedSize, selectedColor);
      // Optional: Add a toast or animation here
      navigation.goBack();
    }
  };

  if (loading || !product) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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
        <TouchableOpacity 
          style={[styles.cartButton, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Cart' as never)}
        >
          <Ionicons name="cart-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
        
        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]}>{product.title}</Text>
            <Text style={[styles.price, { color: Colors.primary }]}>${product.price.toFixed(2)}</Text>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={[styles.rating, { color: theme.text }]}>{product.rating}</Text>
            <Text style={[styles.reviews, { color: theme.textSecondary }]}>({product.reviewsCount} reviews)</Text>
          </View>

          <Text style={[styles.description, { color: theme.textSecondary }]}>{product.description}</Text>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <View style={styles.selectionContainer}>
              <Text style={[styles.selectionTitle, { color: theme.text }]}>Color</Text>
              <View style={styles.optionsRow}>
                {product.colors.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { borderColor: selectedColor === color ? Colors.primary : theme.border },
                      selectedColor === color && { backgroundColor: `${Colors.primary}20` }
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <Text style={[
                      styles.colorText,
                      { color: selectedColor === color ? Colors.primary : theme.text }
                    ]}>{color}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <View style={styles.selectionContainer}>
              <Text style={[styles.selectionTitle, { color: theme.text }]}>Size</Text>
              <View style={styles.optionsRow}>
                {product.sizes.map(size => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeOption,
                      { borderColor: selectedSize === size ? Colors.primary : theme.border },
                      selectedSize === size && { backgroundColor: Colors.primary }
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[
                      styles.sizeText,
                      { color: selectedSize === size ? '#fff' : theme.text }
                    ]}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.cardBackground, borderTopColor: theme.border }]}>
        <View style={styles.priceContainer}>
          <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>Total Price</Text>
          <Text style={[styles.bottomPrice, { color: theme.text }]}>${product.price.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={[styles.addToCartBtn, { backgroundColor: Colors.primary }]} onPress={handleAddToCart}>
          <Ionicons name="cart" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
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
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    backgroundColor: 'transparent',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 4,
    marginRight: 8,
  },
  reviews: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
    marginBottom: 30,
  },
  selectionContainer: {
    marginBottom: 20,
  },
  selectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  colorText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  sizeOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  sizeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    ...Platform.select({
      ios: { paddingBottom: 34 },
    })
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
  },
  bottomPrice: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
  },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 30,
    flex: 1.5,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  }
});
