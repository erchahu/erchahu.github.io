---
title: 用 expo 搭建 React-Native 新手教程
date: 2025-08-26 14:06:48
tags:
  - react-native
  - expo
---

## 1. expo 前言

1. 官方网址: https://expo.dev/

2. expo 是什么? 是一个围绕`React Native`构建的平台，提供了一套强大的工具和服务，极大地简化了`React Native`应用的开发、构建、部署流程。

3. expo 核心优势
    - 降低门槛： 无需配置复杂的`Android Studio/Xcode`原生开发环境。一个`Node.js`和手机（或模拟器）就可以开始。

    - 开箱即用： 集成了大量常用的原生API（如相机、地理位置、传感器等），通过`expo install`即可轻松使用，无需手动链接原生代码。

    - 快速迭代： 通过`Expo Go App`，你可以在真机上实时预览更改，开发体验无比顺滑。

    - 简化发布： 通过`expo publish`一键OTA（Over-The-Air）更新，以及`eas build`云服务打包成`ipa/apk`文件。

4. 需要注意的局限性

    - 某些需要深度定制原生代码的特定原生模块可能无法使用（但`Expo`一直在通过开发构建`(dev client)`和预构建`(prebuild)`打破这个限制，现在绝大多数需求都能满足）。


## 2. 环境搭建
1. 安装`Node.js`: 确保你的电脑安装了LTS版本的Node.js（>= 16）。

2. 安装`Expo CLI` (我们的核心命令行工具):
    ```bash
    npm install -g expo-cli
    ```

    安装后，在终端输入 `expo --version` 验证是否成功。

3. 在手机上安装`Expo Go App`:

    - iOS: 在App Store搜索 “Expo Go”。

    - Android: 在Google Play搜索 “Expo Go”。

## 3. 创建第一个EXPO - REACT_NATIVE 项目

1. 创建项目:
    ```bash
    npx create-expo-app MyFirstExpoProject --template
    ```

2. 进入项目并启动
    ```bash
    cd MyFirstExpoProject
    npm start
    # 或者
    npx expo start
    ```

3. 在真机上预览:

    - 打开手机上的Expo Go App。

    - 点击“Scan QR Code”，扫描终端弹出的二维码。

    - 稍等片刻，你的手机界面就会出现`Open up App.tsx to start working on your app!`！

## 4. 新建一个计数器功能
```typescript
import { StatusBar } from 'expo-status-bar';
import { memo, useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UnitButtonProps {
  type: 'add' | 'minus';
  onPress: () => void;
}

const TYPE_MAPS: {
  [key in UnitButtonProps['type']]: string
} = {
  'add': '+',
  'minus': '-'
}

const UnitButton = memo(({ type, onPress }: UnitButtonProps) => {
  const showType = useMemo(() => TYPE_MAPS[type], [type]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{showType}</Text>
    </TouchableOpacity>
  );
});

export default function App() {
  const [count, setCount] = useState<number>(0);

  const onAdd = useCallback(() => {
    setCount(prevCount => prevCount + 1);
  }, []);

  const onMinus = useCallback(() => {
    setCount(prevCount => prevCount - 1);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>计数器应用</Text>
      
      <Text style={styles.numText}>当前数值: {count}</Text>

      <View style={styles.row}>
        <UnitButton type={'minus'} onPress={onMinus} />
        <UnitButton type={'add'} onPress={onAdd} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  numText: {
    fontSize: 32,
    fontWeight: '600',
    color: 'orange',
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Android阴影
    shadowColor: '#000', // iOS阴影
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  cameraSection: {
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#666',
  },
});
```

## 5. 使用 expo 内置 API, 以相机为例

1. 安装相机模块:

    ```bash
    npx expo install expo-camera
    ```

2. 修改 `app.json`

    ```json
    "expo": {
      "plugins": [
        [
          "expo-camera",
          {
            "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
            "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
            "recordAudioAndroid": true
          }
        ]
      ]
    }
    ```

3.  编写`CameraScreen.tsx`代码

    ```typescript
    import { CameraView, useCameraPermissions } from 'expo-camera';
    import { memo, useState } from 'react';
    import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

    const CameraScreen = memo(() => {
    const [facing, setFacing] = useState<'front' | 'back'>('back');
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return <View style={cameraStyles.centerContainer}><Text>请求权限中...</Text></View>;
    }

    if (!permission.granted) {
        return (
        <View style={cameraStyles.centerContainer}>
            <Text style={cameraStyles.permissionText}>需要相机权限才能使用此功能</Text>
            <Button title="授权相机" onPress={requestPermission} />
        </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <View style={cameraStyles.container}>
        <CameraView 
            style={cameraStyles.camera} 
            facing={facing}
        >
            <View style={cameraStyles.buttonContainer}>
            <TouchableOpacity style={cameraStyles.flipButton} onPress={toggleCameraFacing}>
                <Text style={cameraStyles.text}>翻转相机</Text>
            </TouchableOpacity>
            </View>
        </CameraView>
        </View>
    );
    });

    export default function App() {

    return (
        <View style={styles.cameraSection}>
        <Text style={styles.sectionTitle}>相机预览</Text>
        <CameraScreen />
        </View>
    );
    }

    const styles = StyleSheet.create({
    cameraSection: {
        width: '100%',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#666',
    },
    });

    const cameraStyles = StyleSheet.create({
    centerContainer: {
        width: 300,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        borderRadius: 10,
    },
    permissionText: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
        paddingHorizontal: 20,
    },
    container: {
        width: 300,
        height: 300,
        overflow: 'hidden',
        borderRadius: 15,
        marginVertical: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    flipButton: {
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    });
    ```