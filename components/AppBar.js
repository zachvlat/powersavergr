import * as React from 'react';
import { Appbar } from 'react-native-paper';

const PaperAppbar = () => (
  <Appbar.Header>
    <Appbar.BackAction onPress={() => {}} />
    <Appbar.Content title="Τιμές Ρεύματος" />
  </Appbar.Header>
);

export default PaperAppbar;