import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import styles from './styles';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Alert,
  View,
  ActivityIndicator,
} from 'react-native';
import Parse from 'parse/react-native.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore, {firebase} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {TextInput, TouchableHighlight} from 'react-native-gesture-handler';
import HeraLetra from '../../../assets/heraletra.svg';
import Spinner from 'react-native-loading-spinner-overlay';
import Line from '../../../assets/line.svg';
import RNSmtpMailer from 'react-native-smtp-mailer';
import TabNavigator from '../../components/TabNavigator';
export default function App({route}) {
  const navigation = useNavigation();
  const [tipoUsuaria, setTipoUsuaria] = useState('');
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [anjos, setAnjos] = useState([]);
  const [valores, setValores] = useState([]);

  useEffect(function () {
    (async () => {
      const user = auth().currentUser;
      const userJSON = user.toJSON();

      (await firestore().collectionGroup('Anjo').get()).forEach(doc => {
        if (doc.exists && doc.data().email == userJSON.email) {
          setTipoUsuaria(doc.data().tipousuaria);
          setCpf(doc.data().cpf);
          var valor = doc.data().nome.split(' ');
          var soNome = valor.shift();
          console.log(soNome);
          console.log(tipoUsuaria);
          setNome(soNome);
        }
      });

      (await firestore().collection('Usuarias').get()).forEach(doc => {
        if (doc.exists && doc.data().email == userJSON.email) {
          setTipoUsuaria(doc.data().tipousuaria);
          setCpf(doc.data().cpf);
          var valor = doc.data().nome.split(' ');
          var soNome = valor.shift();
          console.log(tipoUsuaria);
          setNome(soNome);
        }
      });

      await firestore()
        .collection('Usuarias')
        .doc(cpf)
        .collection('Anjo')
        .get()
        .then(function (querySnapshot) {
          var anjos = [];
          querySnapshot.forEach(function (doc) {
            anjos.push(doc.data());
          });
          setValores(anjos);
        });
    })();

    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Home');
    });
  });

  const [emailAnjo, setemailAnjo] = useState('');
  const [nomeAnjo, setNomeAnjo] = useState('');
  const [email, setEmail] = useState('');
  const [cpfUsuaria, setCpfUsuaria] = useState('');

  const [loading, setLoading] = useState(false);
  const [refreshPage, setRefreshPage] = useState('');

  Parse.setAsyncStorage(AsyncStorage);
  Parse.initialize(
    'Wcq3vd9GbWK5zSizipXUwUvF3hsZIT7NQvX0x9Gz',
    '1nWgFG26b8YiAzAQEkxnRcRBqApfN4W8cWTieK2h',
  );
  Parse.serverURL = 'https://parseapi.back4app.com/';
  var anj;

  async function trocarTipoUsuaria(nmr) {
    //identificar a usuaria primeiro
    const user = auth().currentUser;
    const userJSON = user.toJSON();
    var cpf;

    (await firestore().collection('Usuarias').get()).forEach(doc => {
      if (doc.data().email == userJSON.email) {
        cpf = doc.data().cpf;
      }
    });

    if (nmr == 0) {
      firestore()
        .collection('Usuarias')
        .doc(cpf)
        .update({
          tipousuaria: 'HÍBRIDA',
        })
        .then(() => {
          Alert.alert('Sucesso!', 'Você agora é uma usuária híbrida!', [
            {text: 'OK', onPress: () => setTipoUsuaria('HÍBRIDA')},
          ]);
        });
    } else {
      //pegar dados do usuario
      (await firestore().collectionGroup('Anjo').get())
        .forEach(doc => {
          if (doc.data().email == userJSON.email) {
            var anjo = doc.data();
            console.log(anjo);
            firestore()
              .collection('Usuarias')
              .doc(anjo.cpf)
              .set({
                nome: anjo.nome,
                email: anjo.email,
                cpf: anjo.cpf,
                datanascimento: anjo.datanascimento,
                telefone: anjo.telefone,
                cep: anjo.cep,
                idtelegram: anjo.idtelegram,
                logradouro: anjo.logradouro,
                numero: anjo.numero,
                bairro: anjo.bairro,
                complemento: anjo.complemento,
                cidade: anjo.cidade,
                estado: anjo.estado,
                tipousuaria: 'HÍBRIDA',
              })
              .then(() => {
                Alert.alert('Sucesso!', 'Você agora é uma usuária híbrida!');
              })
              .catch(() => {
                Alert.alert('Erro ao alterar tipo de usuária!');
              });
          }
        })
        .then(() => {
          //identificar a usuaria primeiro
        });
    }
  }

  async function salvarAnjo() {
    setLoading(true);
    //identificar a usuaria primeiro
    const user = auth().currentUser;
    const userJSON = user.toJSON();
    const email = userJSON.email;

    //verificar se o anjo já existe
    firestore()
      .collectionGroup('Anjo')
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (doc.data().email == emailAnjo) {
            anj = doc.data();
          } else {
            console.log('Anjo não cadastrado');
          }
        });
      })
      .catch(function (error) {
        console.log('Error getting documents: ', error);
      });

    await firestore()
      .collection('Usuarias')
      .where('email', '==', email)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          setCpfUsuaria(doc.data().cpf);
          console.log(doc.data().cpf);
        });
      })
      .then(() => {
        if (anj == undefined) {
          firestore()
            .collection('Usuarias')
            .doc(cpfUsuaria)
            .collection('Anjo')
            .doc(emailAnjo)
            .set({
              nome: nomeAnjo,
              email: emailAnjo,
            })
            .then(() => {
              var valor = nomeAnjo.split(' ');
              var soNome = valor.shift();
              var html =
                "<!DOCTYPE html><html xmlns='http://www.w3.org/1999/xhtml'> <head> <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /> <title>Email</title> <meta name='viewport' content='width=device-width, initial-scale=1.0'/></head><body style='margin: 0; padding: 0;'> <table border='0' cellpadding='0' cellspacing='0' style='max-width:100%; padding: 20px;' align='center'> <tr> <td> <table align='center' border='0' cellpadding='0' cellspacing='0' style='border: none; max-width:600'> <tr> <td align='center' bgcolor='#Fae4ef' style='padding: 20px; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;'> <img src='https://i.imgur.com/0yg5m3r.png' alt='Creating Email Magic' width='300' height='230' style='display: block;' /> </td> </tr> <tr> <td bgcolor='#ffffff'> <table border='0' cellpadding='0' cellspacing='0' width='100%'> <tr> <td style='color: #000; font-family: Arial, sans-serif; font-size: 24px; padding: 20px;'> <b>Olá, " +
                soNome +
                "!</b> </td> </tr> <tr> <td style='padding: 20px; color: #000; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;'> <b>Você foi convidado a se tornar Anjo da Guarda de " +
                nome +
                "!</b> </td> </tr> <tr> <td style='padding: 20px ; color: #000; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;'> <b>Para completar o processo, instale nosso aplicativo e cadastre-se!</b> </td> </tr> <tr> <td style=' color: #000; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; display: flex; justify-content: center; align-items: center;'> <button type='submit'style=' width: 230px;height: 50px;max-height: 50px;max-width: 230px;border: none;border-radius: 2em;margin-top: 50px;margin-bottom: 50px;padding:10px ;background-color: #e0195c;'><a href='https://play.google.com/store/?utm_source=latam_Med&utm_medium=hasem&utm_content=Jul1520&utm_campaign=Evergreen&pcampaignid=MKT-FDR-latam-br-1002290-Med-hasem-py-Evergreen-Jul1520-Text_Search_BKWS-41905086&gclid=Cj0KCQjw_fiLBhDOARIsAF4khR13AFcTAEC-95qbHZlRm6Pivj3y5EevqGVLL7J7U_QFF-lnZkKNuvQaAi-aEALw_wcB&gclsrc=aw.ds' target='_blank'style='text-decoration: none;text-transform: uppercase;font-weight: 800;color: #fff;'>Ir para a Play Store ➔</a></button> </td> </tr> <tr> <td style=' max-width: 600px; height: 100px; max-height: 100px; padding: 20px; color: #000; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; background-color: #Fae4ef;'> <b>Copyright © 2021 | Insight</b> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </body> </html>";
              RNSmtpMailer.sendMail({
                mailhost: 'smtp.gmail.com',
                port: '465',
                ssl: true, // optional. if false, then TLS is enabled. Its true by default in android. In iOS TLS/SSL is determined automatically, and this field doesn't affect anything
                username: 'tccinsight@gmail.com',
                password: 'tcc@2021',
                fromName: 'Equipe Hera', // optional
                replyTo: emailAnjo, // optional
                recipients: emailAnjo,
                subject: 'Anjo da Guarda - Hera',
                htmlBody: html,
              });
              alert('Êxito!', 'Dados cadastrados com sucesso', [
                {
                  text: 'OK',
                },
              ]);

              var valor = nomeAnjo.split(' ');
              var soNome = valor.shift();
              firestore()
                .collection('AllMensages')
                .add({
                  name: soNome + ' e ' + nome,
                  cpfUsuaria: cpf,
                  emailAnjo: emailAnjo,
                  latestMessage: {
                    text: `Bem vindo!`,
                    createdAt: new Date().getTime(),
                  },
                })
                .then(docRef => {
                  docRef.collection('Mensages').add({
                    text: `Bem vindo!`,
                    createdAt: new Date().getTime(),
                    system: true,
                  });
                });
            })
            .catch(() => {
              alert('Erro!', 'Erro ao cadastrar os dados', [
                {
                  text: 'OK',
                },
              ]);
            });
        } else {
          console.log('Anjo já cadastrado');
          console.log(anj);
          firestore()
            .collection('Usuarias')
            .doc(cpf)
            .collection('Anjo')
            .doc(emailAnjo)
            .set({
              nome: nomeAnjo,
              email: emailAnjo,
              bairro: anj.bairro,
              cep: anj.cep,
              cidade: anj.cidade,
              complemento: anj.complemento,
              cpf: anj.cpf,
              datanascimento: anj.datanascimento,
              estado: anj.estado,
              logradouro: anj.logradouro,
              numero: anj.numero,
              telefone: anj.telefone,
              tipousuaria: anj.tipousuaria,
            })
            .then(() => {
              var html =
                "<!DOCTYPE html><html xmlns='http://www.w3.org/1999/xhtml'> <head> <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /> <title>Email</title> <meta name='viewport' content='width=device-width, initial-scale=1.0'/></head><body style='margin: 0; padding: 0;'> <table border='0' cellpadding='0' cellspacing='0' style='max-width:100%; padding: 20px;' align='center'> <tr> <td> <table align='center' border='0' cellpadding='0' cellspacing='0' style='border: none; max-width:600'> <tr> <td align='center' bgcolor='#Fae4ef' style='padding: 20px; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;'> <img src='https://i.imgur.com/0yg5m3r.png' alt='Creating Email Magic' width='300' height='230' style='display: block;' /> </td> </tr> <tr> <td bgcolor='#ffffff'> <table border='0' cellpadding='0' cellspacing='0' width='100%'> <tr> <td style='color: #000; font-family: Arial, sans-serif; font-size: 24px; padding: 20px;'> <b>Olá, " +
                soNome +
                "!</b> </td> </tr> <tr> <td style='padding: 20px; color: #000; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;'> <b>Você foi convidado a se tornar Anjo da Guarda de " +
                nome +
                "!</b> </td> </tr> <tr> <td style='padding: 20px ; color: #000; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;'> <b>Para completar o processo, instale nosso aplicativo e cadastre-se!</b> </td> </tr> <tr> <td style=' color: #000; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; display: flex; justify-content: center; align-items: center;'> <button type='submit'style=' width: 230px;height: 50px;max-height: 50px;max-width: 230px;border: none;border-radius: 2em;margin-top: 50px;margin-bottom: 50px;padding:10px ;background-color: #e0195c;'><a href='https://play.google.com/store/?utm_source=latam_Med&utm_medium=hasem&utm_content=Jul1520&utm_campaign=Evergreen&pcampaignid=MKT-FDR-latam-br-1002290-Med-hasem-py-Evergreen-Jul1520-Text_Search_BKWS-41905086&gclid=Cj0KCQjw_fiLBhDOARIsAF4khR13AFcTAEC-95qbHZlRm6Pivj3y5EevqGVLL7J7U_QFF-lnZkKNuvQaAi-aEALw_wcB&gclsrc=aw.ds' target='_blank'style='text-decoration: none;text-transform: uppercase;font-weight: 800;color: #fff;'>Ir para a Play Store ➔</a></button> </td> </tr> <tr> <td style=' max-width: 600px; height: 100px; max-height: 100px; padding: 20px; color: #000; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; background-color: #Fae4ef;'> <b>Copyright © 2021 | Insight</b> </td> </tr> </table> </td> </tr> </table> </td> </tr> </table> </body> </html>";

              RNSmtpMailer.sendMail({
                mailhost: 'smtp.gmail.com',
                port: '465',
                ssl: true, // optional. if false, then TLS is enabled. Its true by default in android. In iOS TLS/SSL is determined automatically, and this field doesn't affect anything
                username: 'tccinsight@gmail.com',
                password: 'tcc@2021',
                fromName: 'Equipe Hera', // optional
                replyTo: 'gabrielmiguel656@gmail.com', // optional
                recipients: 'gabrielmiguel656@gmail.com',
                subject: 'Anjo da Guarda - Hera',
                htmlBody: html,
              });
              alert('Êxito!', 'O Anjo foi adicionado com sucesso!', [
                {
                  text: 'OK',
                },
              ]);
              var valor = nomeAnjo.split(' ');
              var soNome = valor.shift();
              firestore()
                .collection('AllMensages')
                .add({
                  name: soNome + ' e ' + nome,
                  cpfUsuaria: cpf,
                  emailAnjo: emailAnjo,
                  latestMessage: {
                    text: `Bem vindo!`,
                    createdAt: new Date().getTime(),
                  },
                })
                .then(docRef => {
                  docRef.collection('Mensages').add({
                    text: `Bem vindo!`,
                    createdAt: new Date().getTime(),
                    system: true,
                  });
                });
            })
            .catch(() => {
              alert('Erro!', 'Erro ao cadastrar os dados', [
                {
                  text: 'OK',
                },
              ]);
            });
        }
      });
    setemailAnjo('');
    setNomeAnjo('');
    setLoading(false);
  }

  if (tipoUsuaria == 'USUÁRIA') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headText}>Adicionar Anjo</Text>
        </View>
        <View style={styles.insideContainer}>
          <View style={styles.part1}>
            <Text style={styles.textDescription}>
              Preencha os campos para adicionar um anjo!
            </Text>
            <TextInput
              onChangeText={text => {
                setNomeAnjo(text);
              }}
              style={styles.textInput}
              value={nomeAnjo}
              placeholder="Nome"
            />

            <TextInput
              onChangeText={text => {
                setemailAnjo(text);
              }}
              style={styles.textInput}
              value={emailAnjo}
              placeholder="Email"
            />

            <TouchableOpacity onPress={salvarAnjo} style={styles.buttonSalvar}>
              <Text style={styles.buttonSalvarText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => setLoading(true)}>
            <Text style={styles.buttonVoltarText}>Voltar</Text>
          </TouchableOpacity>

          <View style={styles.part2}>
            <Text style={styles.textDescription}>Anjos já cadastrados</Text>

            {valores.map(valores => (
              <Text
                key={valores.email}
                style={{fontFamily: 'Montserrat-Regular'}}>
                {valores.nome}{' '}
              </Text>
            ))}
          </View>
        </View>
        <TabNavigator tela="anjo" />
      </View>
    );
  } else if (tipoUsuaria == 'ANJO') {
    return (
      <SafeAreaView style={styles.container}>
        <TabNavigator tela="anjo" />
      </SafeAreaView>
    );
  } else if (loading || tipoUsuaria == '') {
    return (
      <View style={styles.container}>
        <Spinner
          visible={true}
          textStyle={styles.spinnerTextStyle}
          color={'#fff'}
          overlayColor={'rgba(0, 0, 0, 0.5)'}
          key={'spinner'}
          animation={'fade'}
          size={'large'}
        />
      </View>
    );
  }
}
