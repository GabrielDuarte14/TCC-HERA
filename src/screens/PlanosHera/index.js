import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import styles from './styles';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  BackHandler,
  Image,
  Alert,
  View,
  ActivityIndicator,
} from 'react-native';

import {useNavigation} from '@react-navigation/native';

import HeraLetra from '../../../assets/heraletra.svg';

export default function App({route}) {
  const navigation = useNavigation();
  const [tipoUsuaria, setTipoUsuaria] = useState('');
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [anjos, setAnjos] = useState([]);
  const [valores, setValores] = useState([]);
  const [visible, setVisible] = useState(false);

  var cpfpassado = route.params?.cpfpassado;
  var nomepassado = route.params?.nomepassado;
  var emailpassado = route.params?.emailpassado;
  var tipousuariapassado = route.params?.tipousuariapassado;
  var tipoLoginPassado = route.params?.tipologin;


    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.navigate("Cadastro-Pt1")
        
        });
    }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <HeraLetra />
        <Text style={styles.titulo}>Qual plano você deseja?</Text>
      </View>
      <View style={styles.body}>

      <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
           
            navigation.navigate('Cadastro-pt2', {
              cpfpassado: cpfpassado,
              nomepassado: nomepassado,
              emailpassado: emailpassado,
              tipousuariapassado: tipousuariapassado,
              plano: 'free',
              tipoLoginPassado: tipoLoginPassado
            });

          }}
          style={styles.naosei}>
          <View style={styles.card}>
            <View style={styles.imgCard}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: 'center',
                  tintColor: '#fff',
                  alignSelf: 'flex-start',
                }}
                source={require('../../../assets/heraletra.png')}
              />
            </View>
            <View style={styles.texts}>
              <Text style={[styles.titleCard, {width: 185, }]}>Prefiro não pagar</Text>
              <Text style={[styles.descCard, {fontSize: 14, width: 190}]}>
                Sem a Pulseira, cadastro limitado de anjos,
                localização em tempo real e abrir chamado manualmente.
              </Text>
             
            </View>
            <Text style={[styles.descCard, {width: 60, marginLeft: 10, fontWeight: 'bold'}]}>
              Grátis
              </Text>
          </View>
        </TouchableOpacity>






        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('Cadastro-pt2', {
              cpfpassado: cpfpassado,
              nomepassado: nomepassado,
              emailpassado: emailpassado,
              tipousuariapassado: tipousuariapassado,
              plano: 'Light'
            });
          }}
          style={styles.naosei}>
          <View style={styles.card}>
            <View style={styles.imgCard}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: 'center',
                  tintColor: '#fff',
                  alignSelf: 'flex-start',
                }}
                source={require('../../../assets/heraletra.png')}
              />
            </View>
            <View style={styles.texts}>
              <Text style={styles.titleCard}>Light</Text>
              <Text style={styles.descCard}>
                Pulseira HERA, cadastro ilimitado de anjos, acesso às notícias e
                localização em tempo real
              </Text>
             
            </View>
            <Text style={[styles.descCard, {width: 60, marginLeft: 10, fontWeight: 'bold'}]}>
               R$ 7,90/mês
              </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
           
            navigation.navigate('Cadastro-pt2', {
              cpfpassado: cpfpassado,
              nomepassado: nomepassado,
              emailpassado: emailpassado,
              tipousuariapassado: tipousuariapassado,
              plano: 'Pro'
            });

          }}
          style={styles.naosei}>
          <View style={styles.card}>
            <View style={styles.imgCard}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: 'center',
                  tintColor: '#fff',
                  alignSelf: 'flex-start',
                }}
                source={require('../../../assets/heraletra.png')}
              />
            </View>
            <View style={styles.texts}>
              <Text style={styles.titleCard}>Pro</Text>
              <Text style={styles.descCard}>
                Mesmos benefícios da Light, porém por três meses (Você ganha 20% de desconto!)
              </Text>
             
            </View>
            <Text style={[styles.descCard, {width: 80, fontWeight: 'bold'}]}>
               R$ 19,99/trimestre
              </Text>
          </View>
        </TouchableOpacity>

       
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
           
            navigation.navigate('Cadastro-pt2', {
              cpfpassado: cpfpassado,
              nomepassado: nomepassado,
              emailpassado: emailpassado,
              tipousuariapassado: tipousuariapassado,
              plano: 'Premium'
            });

          }}
          style={styles.naosei}>
          <View style={styles.card}>
            <View style={styles.imgCard}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  resizeMode: 'center',
                  tintColor: '#fff',
                  alignSelf: 'flex-start',
                }}
                source={require('../../../assets/heraletra.png')}
              />
            </View>
            <View style={styles.texts}>
              <Text style={styles.titleCard}>Premium</Text>
              <Text style={styles.descCard}>
              Mesmos benefícios da Light, porém por um ano (Você ganha 60% de desconto!)
              </Text>
             
            </View>
            <Text style={[styles.descCard, {width: 80, fontWeight: 'bold'}]}>
               R$ 59,99/anual
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
