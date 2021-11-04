import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import {
  //Text,
  View,
  Image,
  BackHandler,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import messaging from '@react-native-firebase/messaging';
import Spinner from 'react-native-loading-spinner-overlay';
import TabNavigator from '../../components/TabNavigator';
import {Modalize} from 'react-native-modalize';
import Parse from 'parse/react-native.js';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {NativeEventEmitter} from 'react-native';
import Line from '../../../assets/line.svg';
import BluetoothButtonConnect from '../../../assets/btnConnect.svg';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import {Text, TextInput} from 'react-native-paper';
import HeraLetra from '../../../assets/heraletra.svg';


var chamado = false;
var a = 0;

export default function App({route}) {
  const navigation = useNavigation();
  const modalizeRef = useRef(null);
  const [elevation, setElevation] = useState(20);
  const [assinante, setAssinante] = useState(false);
  const [idTelegram, setIdTelegram] = useState(0);
  const [idTelegramDef, setIdTelegramDef] = useState('');
  const [idsTelegram, setIdsTelegram] = useState([]);
  const [lat, SetLatitude] = useState(0);
  const [lon, SetLongitude] = useState(0);
  const [email, setEmail] = useState('');
  const [tipoUsuaria, setTipoUsuaria] = useState('');
  const [permitiu, setPermitiu] = useState(false);
  const [nomeUsuaria, setNomeUsuaria] = useState('');
  const [cpfUsuariaAnjo, setCpfUsuariaAnjo] = useState('');
  const [conectado, setConectado] = useState(false);

  var emailAuth='';
  ReactNativeForegroundService.register();

  ReactNativeForegroundService.add_task(() => {}, {
    delay: 100,
    onLoop: true,
    taskId: 'taskid',
    onError: e => console.log(`Error logging:`, e),
  });


  useEffect(() => {
  emailAuth = (auth().currentUser.email);
      console.log(emailAuth);
    (async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Hera',
            message: 'Hera gostaria de utilizar seu GPS',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the location');
          setPermitiu(true);
        } else {
          console.log('location permission denied');
          alert('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
      
    })();

    BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Alerta!',
        'Deseja sair do aplicativo?',
        [
          {
            text: 'Não',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Sim', onPress: () => BackHandler.exitApp()},
        ],
        {cancelable: false},
      );
      
    });

    ReactNativeForegroundService.start({
      id: 144,
      title: 'Hera',
      message: 'Você está protegida!',
      vibration: true,
      smallIcon: 'ic_notification',
      icon: 'ic_notification',
      largeicon: 'ic_notification',
      importance: 'high',
    });
   
    
     
  }, []);


  useLayoutEffect( ()=>{
     (async()=>{
      var emailAuth = auth().currentUser.email;
      console.log(emailAuth);
    (await firestore().collectionGroup('Anjo').get()).forEach(doc => {
      console.log('saaaaa');
      if (doc.exists && doc.data().email == emailAuth) {
        console.log(doc.data().nome);
        setNomeUsuaria(doc.data().nome);
        setTipoUsuaria(doc.data().tipousuaria);
        setIdTelegram(doc.data().idtelegram);
        console.log(nomeUsuaria);
      }
    });

    await firestore()
      .collectionGroup('Anjo')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (doc.data().email == emailAuth) {
            var cpfNome = '';
            cpfNome = doc.ref.path.split('/')[1];
            setCpfUsuariaAnjo(cpfNome);
          }
        });
      });

    (await firestore().collection('Usuarias').get()).forEach(doc => {
      console.log(doc.data());

      if (doc.data().email == emailAuth) {
        setNomeUsuaria(doc.data().nome);
        setTipoUsuaria(doc.data().tipousuaria);
        setIdTelegram(doc.data().idtelegram);
        console.log(doc.data());
      }
    });
    const emailsUsu = firestore().collection('Usuarias');
    const emailAnj = firestore().collection('Anjo');

    if (emailAuth != null) {
      const queryUser = await emailsUsu
        .where('email', '==', emailAuth)
        .get();

      if (!queryUser.empty) {
      setTipoUsuaria(queryUser.docs[0].data().tipousuaria);
        setNomeUsuaria(queryUser.docs[0].data().nome);
        setAssinante(queryUser.docs[0].data().assinante);
        console.log(queryUser.docs[0].data().assinante);
      } else {
        //setNomeUsuaria(queryUser.docs[0].data().nome);
      }
    }
  })()
  });

  Parse.setAsyncStorage(AsyncStorage);
  Parse.initialize(
    'eD7UMdVkUHltyi6ee3JoLnyTShOAhQaAW9uQVKR8',
    'icWdGRfOy8imxHAvP4oh8fTDUdUABLLH9tGUmR8F',
  );
  Parse.serverURL = 'https://parseapi.back4app.com/';
  
  var emailPassado = route.params?.email;

  async function salvarId(x) {
    var emailAuth = auth().currentUser.email;
      console.log(emailAuth);
    console.log(cpfUsuariaAnjo);
    if (x == 0) {
      var cpf;

      (await firestore().collection('Usuarias').get()).forEach(doc => {
        console.log(emailAuth);
        if (doc.data().email == emailAuth) {
          cpf = doc.data().cpf;
        }
      });

      console.log(cpf);
      await firestore()
        .collection('Usuarias')
        .doc(cpf)
        .update({
          idtelegram: idTelegramDef,
        })
        .then(() => {
          Alert.alert('Sucesso!', 'Id Telegram salvo com sucesso!');
          setIdTelegram(idTelegramDef);
        })
        .catch(error => {
          console.log(emailAuth);
          Alert.alert('Erro!', 'Erro ao salvar Id Telegram! ' + error);
        });
    } else {
      await firestore()
        .collection('Usuarias')
        .doc(cpfUsuariaAnjo)
        .collection('Anjo')
        .doc(emailAuth)
        .update({
          idtelegram: idTelegramDef,
        })
        .then(() => {
          Alert.alert('Sucesso!', 'Id Telegram salvo com sucesso!');
          setIdTelegram(idTelegramDef);
        })
        .catch(error => {
          console.log(emailAuth);
          Alert.alert('Erro!', 'Erro ao salvar Id Telegram! ' + error);
        });
    }
  }

  async function logout() {
    console.log('logout');
    Alert.alert(
      'Alerta!',
      'Deseja desconectar da sua conta?',
      [
        {
          text: 'Não',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Sim',
          onPress: async () => {
           await auth()
              .signOut()
              .then(() => {
                ReactNativeForegroundService.stop();
                ReactNativeForegroundService.remove_task('taskid');
                setTipoUsuaria('');
                setNomeUsuaria('');
                setEmail('');
                setIdTelegram('');
                setCpfUsuariaAnjo('');
                setConectado(false);
                setAssinante(false);
                setTipoUsuaria('');
                
                navigation.navigate('Login');
              });
          },
        },
      ],
      {cancelable: false},
    );
  }

  if (tipoUsuaria == 'USUÁRIA') {
    console.log(tipoUsuaria);

    return (
      <View style={styles.container}>
        {' '}
        {/* não mexe aqui */}
        <View style={styles.headContainer}>
          {' '}
          {/* não mexe aqui */}
          <Text style={{color: 'gray', fontSize: 18, fontFamily: 'Bahnscrift'}}>
            Bem vind@, Usuári@
          </Text>
          <Text style={{color: 'black', fontSize: 30}}>{nomeUsuaria}</Text>
          <Line />
          {assinante ? (
            <Text style={{color: 'black', fontSize: 25}}>
              Conectar a pulseira
            </Text>
          ) : null}
        </View>
        <View style={styles.ladoLogout}>
          <TouchableOpacity style={styles.btnLogout} onPress={logout}>
            <Image
              source={require('../../../assets/logout.png')}
              style={styles.logout}
            />
          </TouchableOpacity>
        </View>
        {assinante ? (
          <>
            <BluetoothButtonConnect />
            <TouchableOpacity onPress={() => console.log('conecta')}>
              <Text>Conectado</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={{
                display: 'flex',
                alignContent: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}
              onPress={() => enviarTempoEmTempo()}>
              <Image
                source={require('../../../assets/alert.png')}
                style={{width: 250, height: 250}}
              />
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Montserrat-Bold',
                  color: '#000',
                  marginTop: 20,
                  marginLeft: 30,
                }}>
                ABRIR CHAMADO
              </Text>
            </TouchableOpacity>
          </>
        )}
        <View style={[styles.categoriesContainer]}>
          <Text style={{padding: 15, fontWeight: 'bold', fontSize: 20}}>
            Categorias
          </Text>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.cardContainer}>
            <View style={[styles.cardPrincipal, {elevation: elevation}]}>
              <Image
                source={require('../../../assets/noticia.png')}
                style={styles.imgCardPrin}
              />
              <Text style={styles.tituloCardPrincipal}>Notícias</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Noticias');
                }}>
                <Image
                  source={require('../../../assets/proximo.png')}
                  style={styles.imgProxPrin}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.card, {elevation: elevation}]}>
              <Image
                source={require('../../../assets/marcar-no-mapa.png')}
                style={styles.imgCard}
              />

              <Text style={styles.tituloCard}>Locais</Text>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    const token = await messaging().getToken();
                    console.log('token do usuário:', token);
                    messaging().sendMessage({
                      to: token,
                      title: 'Teste',
                      body: 'Teste',
                    });
                  } catch (error) {
                    console.error(error);
                  }
                }}>
                <Image
                  source={require('../../../assets/proximo.png')}
                  style={styles.imgProx}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.card, {elevation: elevation}]}>
              <Image
                source={require('../../../assets/anjo1.png')}
                style={styles.imgCard}
              />

              <Text style={styles.tituloCard}>Anjos da Guarda</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AdicionarAnjo', {
                    tipoUsuaria: tipoUsuaria,
                  });
                }}>
                <Image
                  source={require('../../../assets/proximo.png')}
                  style={styles.imgProx}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <Modalize
          ref={modalizeRef}
          scrollViewProps={{
            showsVerticalScrollIndicator: false,
          }}
          withHandle={false}
          snapPoint={Dimensions.get('window').height}
          panGestureEnabled={false}
          rootStyle={{zIndex: 20, elevation: 50}}
          modalHeight={Dimensions.get('window').height}
          HeaderComponent={
            <View
              style={{
                position: 'absolute',
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                height: '100%',
              }}>
              <TouchableOpacity
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  width: Dimensions.get('window').width - 100,
                  backgroundColor: '#E0195C',
                  borderRadius: 150,
                  margin: 50,
                  height: 50,
                  zIndex: 15,
                  elevation: 20,
                  borderColor: '#000',
                  borderWidth: 1.4,
                }}
                onPress={cancelarChamado}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Roboto',
                    fontWeight: '700',
                  }}>
                  CANCELAR CHAMADO
                </Text>
              </TouchableOpacity>
            </View>
          }
        />
        <View style={styles.footer}>
      
    
          <TabNavigator tela="home" />
        </View>
      </View>
    );
  } else if (tipoUsuaria == 'ANJO') {
    console.log(tipoUsuaria);
    if (idTelegram == 0) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
          <View style={styles.textContainerTelegramDescription}>
            <HeraLetra style={styles.hera} />

            <Text style={styles.subTextTelegramDescription}>
              Você precisa se conectar ao Telegram para continuar
            </Text>
            <Text
              style={styles.textTelegramDescription}
              onPress={() => Linking.openURL('https://t.me/EquipeHera_bot')}>
              Toque aqui<Text> e envie "/meu-id" para o Telegram da Hera</Text>
            </Text>
          </View>

          <TextInput
            placeholder="Cole aqui o seu ID"
            onChangeText={text => setIdTelegramDef(text)}
            style={styles.textInputTelegramDescription}
          />
          <TouchableOpacity
            style={styles.buttonTelegramDescription}
            onPress={() => {
              salvarId(1);
            }}>
            <Text
              style={{
                color: '#FFF',
                fontFamily: 'Montserrat-Bold',
                fontSize: 20,
              }}>
              Salvar
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.headContainer}>
          <Text style={{color: 'gray', fontSize: 18, fontFamily: 'Bahnscrift'}}>
            Bem vind@, Anjo
          </Text>
          <Text style={{color: 'black', fontSize: 30}}>{nomeUsuaria}</Text>
          <Line />
          {assinante ? (
            <Text style={{color: 'black', fontSize: 25}}>
              Conectar a pulseira
            </Text>
          ) : null}
        </View>
        <View style={styles.ladoLogout}>
          <TouchableOpacity style={styles.btnLogout} onPress={logout}>
            <Image
              source={require('../../../assets/logout.png')}
              style={styles.logout}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.categoriesContainer]}>
          <Text style={{padding: 15, fontWeight: 'bold', fontSize: 20}}>
            Categorias
          </Text>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.cardContainer}>
            <View style={[styles.cardPrincipal, {elevation: elevation}]}>
              <Image
                source={require('../../../assets/noticia.png')}
                style={styles.imgCardPrin}
              />
              <Text style={styles.tituloCardPrincipal}>Notícias</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Noticias');
                }}>
                <Image
                  source={require('../../../assets/proximo.png')}
                  style={styles.imgProxPrin}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.card, {elevation: elevation}]}>
              <Image
                source={require('../../../assets/marcar-no-mapa.png')}
                style={styles.imgCard}
              />

              <Text style={styles.tituloCard}>Locais</Text>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    const token = await messaging().getToken();
                    console.log('token do usuário:', token);
                    messaging().sendMessage({
                      to: token,
                      title: 'Teste',
                      body: 'Teste',
                    });
                  } catch (error) {
                    console.error(error);
                  }
                }}>
                <Image
                  source={require('../../../assets/proximo.png')}
                  style={styles.imgProx}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.card, {elevation: elevation}]}>
              <Image
                source={require('../../../assets/anjo1.png')}
                style={styles.imgCard}
              />

              <Text style={styles.tituloCard}>Anjos da Guarda</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AdicionarAnjo', {
                    tipoUsuaria: tipoUsuaria,
                  });
                }}>
                <Image
                  source={require('../../../assets/proximo.png')}
                  style={styles.imgProx}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <Modalize
          ref={modalizeRef}
          scrollViewProps={{
            showsVerticalScrollIndicator: false,
          }}
          withHandle={false}
          snapPoint={Dimensions.get('window').height}
          panGestureEnabled={false}
          rootStyle={{zIndex: 20, elevation: 50}}
          modalHeight={Dimensions.get('window').height}
          HeaderComponent={
            <View
              style={{
                position: 'absolute',
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                height: '100%',
              }}>
              <TouchableOpacity
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  width: Dimensions.get('window').width - 100,
                  backgroundColor: '#E0195C',
                  borderRadius: 150,
                  margin: 50,
                  height: 50,
                  zIndex: 15,
                  elevation: 20,
                  borderColor: '#000',
                  borderWidth: 1.4,
                }}
                onPress={cancelarChamado}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Roboto',
                    fontWeight: '700',
                  }}>
                  CANCELAR CHAMADO
                </Text>
              </TouchableOpacity>
            </View>
          }
        />

        <View style={styles.footer}>
          <TabNavigator tela="home" />
        </View>
      </View>
    );
  } else if (tipoUsuaria == 'HÍBRIDA') {
    console.log(idTelegram);
    if (idTelegram == 0) {
      return (
        <View
          style={{
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
          <View style={styles.textContainerTelegramDescription}>
            <HeraLetra style={styles.hera} />

            <Text style={styles.subTextTelegramDescription}>
              Você precisa se conectar ao Telegram para continuar
            </Text>
            <Text
              style={styles.textTelegramDescription}
              onPress={() => Linking.openURL('https://t.me/EquipeHera_bot')}>
              Toque aqui<Text> e envie '/meu-id' para o Telegram da Hera</Text>
            </Text>
          </View>

          <TextInput
            placeholder="Cole aqui o seu ID"
            onChangeText={text => setIdTelegramDef(text)}
            style={styles.textInputTelegramDescription}
          />
          <TouchableOpacity
            style={styles.buttonTelegramDescription}
            onPress={() => {
              salvarId(0);
            }}>
            <Text
              style={{
                color: '#FFF',
                fontFamily: 'Montserrat-Bold',
                fontSize: 20,
              }}>
              Salvar
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    console.log(tipoUsuaria);
    return (
      <View style={styles.container}>
        <View style={{display: 'flex', flexDirection:'row', alignContent: "space-between",justifyContent: "space-between"}}>        
          <Text style={[styles.headText, {paddingTop: 0}]}>Bem vind@, Anjo e Usuári@</Text>
        
          <ModalDropdown options={['Perfil', 'Sair']} dropdownTextStyle={{
            fontSize: 18,
            fontFamily: 'Montserrat-Bold',
            color: '#000',
          }} 
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0,
            shadowRadius: 0,
          }}

          animated={true}
            onSelect={(index, value) => {
              if (value == 'Sair') {
                logout();
              } else {
                navigation.navigate('Perfil');
              }
            }}
            dropdownStyle={{
              width: 80,
              height: 100,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              elevation: 0,
              marginRight: 30,
              borderWidth: 2,
             
              borderColor: '#000',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0,
              shadowRadius: 0,
            
          }}>
          <Image source={require('../../../assets/settings.png')} style={{width: 30, height: 30, tintColor: "#fff", marginRight: 10}} />
        </ModalDropdown>
        </View>
        <Text style={[styles.headText, {fontSize: 30, paddingTop: 0}]}>
          {nomeUsuaria}
        </Text>
        

        <View style={styles.insideContainer}>
          <Text
            style={[
              styles.headText,
              {
                fontSize: 20,
                paddingTop: 0,
                color: '#313234',
                alignSelf: 'center',
              },
            ]}>
            Pulseira Conectada
          </Text>
          <TouchableOpacity
            style={{
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
            onPress={() => enviarTempoEmTempo()}>
            <Image
              source={require('../../../assets/alert.png')}
              style={{width: 220, height: 220, alignSelf: 'center',}}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'Montserrat-Bold',
                color: '#000',
                marginTop: 20,
              
                alignSelf: 'center',
              }}>
              ABRIR CHAMADO
            </Text>
          </TouchableOpacity>

          <View style={[styles.categoriesContainer]}>
          <Text style={{padding: 15, fontWeight: 'bold', fontSize: 20}}>
            Categorias
          </Text>

          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.cardContainer}>
            <View style={[styles.cardPrincipal, {elevation: elevation}]}>
              <Image
                source={require('../../../assets/noticia.png')}
                style={styles.imgCardPrin}
              />
              <Text style={styles.tituloCardPrincipal}>Notícias</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Noticias');
                }}>
                <Image
                  source={require('../../../assets/proximo.png')}
                  style={styles.imgProxPrin}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.card, {elevation: elevation}]}>
              <Image
                source={require('../../../assets/marcar-no-mapa.png')}
                style={styles.imgCard}
              />

              <Text style={styles.tituloCard}>Locais</Text>
              <TouchableOpacity
                onPress={async () => {
                  try {
                    const token = await messaging().getToken();
                    console.log('token do usuário:', token);
                    messaging().sendMessage({
                      to: token,
                      title: 'Teste',
                      body: 'Teste',
                    });
                  } catch (error) {
                    console.error(error);
                  }
                }}>
                <Image
                  source={require('../../../assets/proximo.png')}
                  style={styles.imgProx}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.card, {elevation: elevation}]}>
              <Image
                source={require('../../../assets/anjo1.png')}
                style={styles.imgCard}
              />

              <Text style={styles.tituloCard}>Anjos da Guarda</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AdicionarAnjo', {
                    tipoUsuaria: tipoUsuaria,
                  });
                }}>
                <Image
                  source={require('../../../assets/proximo.png')}
                  style={styles.imgProx}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        </View>
        <Modalize
          ref={modalizeRef}
          scrollViewProps={{
            showsVerticalScrollIndicator: false,
          }}
          withHandle={false}
          snapPoint={Dimensions.get('window').height}
          panGestureEnabled={false}
          rootStyle={{zIndex: 20, elevation: 50}}
          modalHeight={Dimensions.get('window').height}
          HeaderComponent={
            <View
              style={{
                position: 'absolute',
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                height: '100%',
              }}>
              <TouchableOpacity
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  width: Dimensions.get('window').width - 100,
                  backgroundColor: '#E0195C',
                  borderRadius: 150,
                  margin: 50,
                  height: 50,
                  zIndex: 15,
                  elevation: 20,
                  borderColor: '#000',
                  borderWidth: 1.4,
                }}
                onPress={cancelarChamado}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'Roboto',
                    fontWeight: '700',
                  }}>
                  CANCELAR CHAMADO
                </Text>
              </TouchableOpacity>
            </View>
          }
        />

        <View style={styles.footer}>
          <TabNavigator tela="home" />
        </View>
      </View>
      
    );
  } else {
   
    return (
      <View style={styles.container}>
        <Spinner
          visible={true}
          textStyle={styles.spinnerTextStyle}
          color={'#E0195C'}
          animation={'slide'}
        />
      </View>
    );
  }

  function EsperarTempo(tempo) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, tempo);
    });
  }

  function mostrarModal() {
    modalizeRef.current?.open();
  }

  async function enviarTempoEmTempo() {
    chamado = true;
    mostrarModal();

    var hora = new Date().getHours();
    hora < 10 ? (hora = '0' + hora) : hora;

    var minuto = new Date().getMinutes();
    minuto < 10 ? (minuto = '0' + minuto) : minuto;

    while (chamado) {
      await obterLocal();

      const user = auth().currentUser;
      const userJSON = user.toJSON();
      const emailzin = userJSON.email;
      console.log(hora + minuto);
      const descobrirCPF = await firestore().collection('Usuarias');
      const queryCPF = await descobrirCPF.where('email', '==', emailzin).get();
      const cpf = queryCPF.docs[0].data().cpf;

      if (a == 0) {
        const user = auth().currentUser;
        const userJSON = user.toJSON();
        const emailzin = userJSON.email;
        console.log(hora + minuto);
        const descobrirCPF = await firestore().collection('Usuarias');
        const queryCPF = await descobrirCPF
          .where('email', '==', emailzin)
          .get();
        const cpf = queryCPF.docs[0].data().cpf;

        await firestore()
          .collection('Usuarias')
          .doc(cpf)
          .collection('Chamados')
          .doc()
          .set({
            lat: lat,
            long: lon,
            data:
              new Date().getDate() +
              '/' +
              (new Date().getMonth() + 1) +
              '/' +
              new Date().getFullYear(),
            hora: hora + ':' + minuto,
          })
          .then(() => {
            console.log('Chamado salvo');
          })
          .catch(() => {
            console.log('Erro ao salvar chamado');
          });
        a++;
      }
      console.log('chamado -------------------------------------' + chamado);
      const result = await EsperarTempo(5000);
    }
  }

  function cancelarChamado() {
    chamado = false;
    a = 0;
    console.log('chamado -------------------------------------' + chamado);
    modalizeRef.current?.close();
  }

  async function obterLocal() {
    console.log('entrou');
    const user = auth().currentUser;
    const userJSON = user.toJSON();
    const emailzin = userJSON.email;
    const descobrirCPF = await firestore().collection('Usuarias');
    const queryCPF = await descobrirCPF.where('email', '==', emailzin).get();
    const cpf = queryCPF.docs[0].data().cpf;

    await firestore()
      .collection('Usuarias')
      .doc(cpf)
      .collection('Anjo')
      .get()
      .then(data => {
        var ids = [];

        data.forEach(doc => {
          ids.push(doc.data().idtelegram);
        });
        setIdsTelegram(ids);
        console.log(idsTelegram);
      });

    if (permitiu) {
      Geolocation.getCurrentPosition(
        pos => {
          console.log('chegou aqui');
          SetLatitude(pos.coords.latitude);
          SetLongitude(pos.coords.longitude);
          EnviarLocal(
            pos.coords.latitude,
            pos.coords.longitude,
            idsTelegram,
            nomeUsuaria,
          );
        },
        erro => {
          console.log('chegou aqui');
          alert('Erro: ' + erro.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          showLocationDialog: true,
        },
      );
    } else {
      Alert.alert('Erro', 'Permita a localização para enviar o local do anjo');
    }
  }

  async function EnviarLocal(lat, long, idsTelegram, nome) {
    console.log(lat + ' ' + long);
    const params1 = {
      lat: lat,
      long: long,
      ids: idsTelegram,
      nome: nome,
    };
    let resultObject = await Parse.Cloud.run('enviarMsg', params1)
      .then(function (result) {
        console.log('Foi!');
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
