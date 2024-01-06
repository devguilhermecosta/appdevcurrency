import React from 'react';
import { View, ActivityIndicator } from 'react-native';

interface LoadingProps {
  transparent?: boolean,
}

export default function Loading(props: LoadingProps): React.JSX.Element {
  return (
    <View style={{ 
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: props.transparent ? 'rgba(0, 0, 0, 0)' : '#121212',
    }}>
      <ActivityIndicator size={28} color="#fff"/>
    </View>
  )
}