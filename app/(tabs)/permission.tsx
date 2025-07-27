import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExplicitPermissionScreen() {
  const [cameraPermission, setCameraPermission] = useState<string | null>(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkPermissions = async () => {
    try {
      const cameraStatus = await Camera.getCameraPermissionsAsync();
      const mediaStatus = await MediaLibrary.getPermissionsAsync();

      setCameraPermission(cameraStatus.status);
      setMediaLibraryPermission(mediaStatus.status);
    } catch {
      Alert.alert("Error", "Failed to check permissions");
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  const requestCameraPermission = async () => {
    setIsLoading(true);
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status);

      if (status === "denied") {
        Alert.alert(
          "Camera Permission Required",
          "Camera access is required to take photos. Please enable it in your device settings.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
      }
    } catch {
      Alert.alert("Error", "Failed to request media library permission");
    } finally {
      setIsLoading(false);
    }
  };

  const requestMediaLibraryPermission = async () => {
    setIsLoading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(status);

      if (status === "denied") {
        Alert.alert(
          "Media Library Permission Required",
          "Media library access is required to save photos. Please enable it in your device settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch {
      Alert.alert("Error", "Failed to request media library permission");
    } finally {
      setIsLoading(false);
    }
  };

  const requestAllPermissions = async () => {
    setIsLoading(true);
    try {
      const [cameraResult, mediaResult] = await Promise.all([
        Camera.requestCameraPermissionsAsync(),
        MediaLibrary.requestPermissionsAsync(),
      ]);

      setCameraPermission(cameraResult.status);
      setMediaLibraryPermission(mediaResult.status);

      if (
        cameraResult.status === "granted" &&
        mediaResult.status === "granted"
      ) {
        Alert.alert("Success", "All permissions granted");
      } else {
        Alert.alert(
          "Permissions Required",
          "Some permissions were denied. Please check your settings."
        );
      }
    } catch {
      Alert.alert("Error", "Failed to request permissions");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "granted":
        return "#4CAF50";
      case "denied":
        return "#F44336";
      case "undetermined":
        return "#FF9800";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case "granted":
        return "Granted";
      case "denied":
        return "Denied";
      case "undetermined":
        return "Not Asked";
      default:
        return "Unknown";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Permission Manager</Text>

      <View style={styles.permissionSection}>
        <Text style={styles.permissionTitle}>Camera Permission</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(cameraPermission) },
            ]}
          />
          <Text style={styles.statusText}>
            {getStatusText(cameraPermission)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={requestCameraPermission}
          disabled={isLoading || cameraPermission === "granted"}
        >
          <Text style={styles.buttonText}>
            {cameraPermission === "granted"
              ? "Already Granted"
              : "Request Camera"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.permissionSection}>
        <Text style={styles.permissionTitle}>Media Library Permission</Text>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(mediaLibraryPermission) },
            ]}
          />
          <Text style={styles.statusText}>
            {getStatusText(mediaLibraryPermission)}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={requestMediaLibraryPermission}
          disabled={isLoading || mediaLibraryPermission === "granted"}
        >
          <Text style={styles.buttonText}>
            {mediaLibraryPermission === "granted"
              ? "Already Granted"
              : "Request Media Library"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={requestAllPermissions}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Requesting..." : "Request All Permissions"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.outlineButton]}
        onPress={checkPermissions}
        disabled={isLoading}
      >
        <Text style={[styles.buttonText, styles.outlineButtonText]}>
          Refresh Status
        </Text>
      </TouchableOpacity>

      {cameraPermission === "granted" &&
        mediaLibraryPermission === "granted" && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              ✅ All permissions granted! You can now use the camera.
            </Text>
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  permissionSection: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: "#666",
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  primaryButton: {
    backgroundColor: "#2196F3",
  },
  secondaryButton: {
    backgroundColor: "#4CAF50",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  outlineButtonText: {
    color: "#2196F3",
  },
  successContainer: {
    backgroundColor: "#E8F5E8",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  successText: {
    color: "#2E7D32",
    fontSize: 16,
    textAlign: "center",
  },
});
