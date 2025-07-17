import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 80) / 3; // 3 columns, 20px margin on each side, 10px gap

interface PhotoUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onChoosePhoto: () => void;
  selectedPhotos: string[];
  onRemovePhoto: (uri: string) => void;
  onAdd: () => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  visible,
  onClose,
  onTakePhoto,
  onChoosePhoto,
  selectedPhotos,
  onRemovePhoto,
  onAdd,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Ionicons name="cloud-upload-outline" size={32} color="#b0b0b0" style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.modalTitle}>Upload files</Text>
              <Text style={styles.modalSubtitle}>Select and upload the files of your choice</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={onTakePhoto}>
              <Ionicons name="camera-outline" size={36} color="#333" />
              <Text style={styles.actionButtonText}>Take photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onChoosePhoto}>
              <Ionicons name="image-outline" size={36} color="#333" />
              <Text style={styles.actionButtonText}>Choose photo</Text>
            </TouchableOpacity>
          </View>

          {/* Selected Photos Grid */}
          <ScrollView contentContainerStyle={styles.photosGrid}>
            {selectedPhotos.map((uri, idx) => (
              <View key={uri + idx} style={styles.photoWrapper}>
                <Image source={{ uri }} style={styles.photo} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => onRemovePhoto(uri)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Add Button */}
          <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalBox: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  closeButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    width: '100%',
    marginVertical: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 18,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 18,
    marginHorizontal: 8,
    minWidth: 120,
  },
  actionButtonText: {
    marginTop: 10,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
    minHeight: PHOTO_SIZE + 10,
    marginBottom: 18,
  },
  photoWrapper: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    margin: 5,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#e6f0fa',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#E53935',
    borderRadius: 10,
    padding: 2,
    zIndex: 2,
  },
  addButton: {
    width: '90%',
    backgroundColor: '#00AEEF',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 