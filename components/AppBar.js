import * as React from 'react';
import { Appbar } from 'react-native-paper';

const PaperAppbar = () => (
  <Appbar.Header>
    <Appbar.BackAction onPress={() => {}} />
    <Appbar.Content title="Power Saver GR" />
    {/* <Appbar.Action icon="calendar" onPress={() => {}} />
    <Appbar.Action icon="magnify" onPress={() => {}} /> */}
  </Appbar.Header>
);

export default PaperAppbar;