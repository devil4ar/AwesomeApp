import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ConfidenceScore } from '../components/ConfidenceScore';
import { OCRResult } from '../types';
import { mockOCRExtraction, validateOCRData } from '../utils/ocr';

export const OCRCaptureScreen: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [editedData, setEditedData] = useState<OCRResult | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleCaptureImage = async () => {
    try {
      // Request camera permission on Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs camera access to scan ID cards.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Camera permission is required to capture images.',
          );
          return;
        }
      }

      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        cameraType: 'back',
        saveToPhotos: false,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to capture image');
        return;
      }

      if (result.assets && result.assets[0].uri) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        processImage(uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to capture image');
    }
  };

  const handleUploadImage = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Failed to upload image');
        return;
      }

      if (result.assets && result.assets[0].uri) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        processImage(uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to upload image');
    }
  };

  const processImage = async (uri: string) => {
    setIsProcessing(true);
    setOcrResult(null);
    setEditedData(null);
    setErrors({});

    try {
      const result = await mockOCRExtraction(uri);
      setOcrResult(result);
      setEditedData(result);
    } catch {
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (!editedData) return;

    const validationErrors = validateOCRData(editedData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Alert.alert('Validation Error', 'Please fix the errors before saving');
      return;
    }

    setErrors({});
    Alert.alert('Success', 'Data saved successfully!', [
      {
        text: 'OK',
        onPress: () => {
          // Reset form
          setImageUri(null);
          setOcrResult(null);
          setEditedData(null);
        },
      },
    ]);
  };

  const updateField = (field: keyof OCRResult, value: string) => {
    if (editedData) {
      setEditedData({ ...editedData, [field]: value });
      // Clear error for this field
      if (errors[field]) {
        const newErrors = { ...errors };
        delete newErrors[field];
        setErrors(newErrors);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ID Card OCR Scanner</Text>
        <Text style={styles.subtitle}>
          Capture or upload an ID card to extract information
        </Text>
      </View>

      {!imageUri ? (
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.button} onPress={handleCaptureImage}>
            <Text style={styles.buttonIcon}>📷</Text>
            <Text style={styles.buttonText}>Capture Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleUploadImage}
          >
            <Text style={styles.buttonIcon}>📁</Text>
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Upload Image
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={() => setImageUri(null)}
            >
              <Text style={styles.retakeText}>↻ Retake</Text>
            </TouchableOpacity>
          </View>

          {isProcessing && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Processing image...</Text>
            </View>
          )}

          {editedData && !isProcessing && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Extracted Information</Text>
              <Text style={styles.formSubtitle}>Review and edit if needed</Text>

              {/* Name Field */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Name</Text>
                  {ocrResult && (
                    <ConfidenceScore score={ocrResult.confidence.name} />
                  )}
                </View>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={editedData.name}
                  onChangeText={text => updateField('name', text)}
                  placeholder="Enter name"
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* ID Number Field */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>ID Number</Text>
                  {ocrResult && (
                    <ConfidenceScore score={ocrResult.confidence.idNumber} />
                  )}
                </View>
                <TextInput
                  style={[styles.input, errors.idNumber && styles.inputError]}
                  value={editedData.idNumber}
                  onChangeText={text => updateField('idNumber', text)}
                  placeholder="Enter ID number"
                />
                {errors.idNumber && (
                  <Text style={styles.errorText}>{errors.idNumber}</Text>
                )}
              </View>

              {/* Date of Birth Field */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Date of Birth</Text>
                  {ocrResult && (
                    <ConfidenceScore score={ocrResult.confidence.dateOfBirth} />
                  )}
                </View>
                <TextInput
                  style={[
                    styles.input,
                    errors.dateOfBirth && styles.inputError,
                  ]}
                  value={editedData.dateOfBirth}
                  onChangeText={text => updateField('dateOfBirth', text)}
                  placeholder="MM/DD/YYYY"
                />
                {errors.dateOfBirth && (
                  <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                )}
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>💾 Save Data</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionContainer: {
    padding: 20,
    gap: 12,
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#3B82F6',
  },
  contentContainer: {
    padding: 20,
  },
  imageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  retakeButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  retakeText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
