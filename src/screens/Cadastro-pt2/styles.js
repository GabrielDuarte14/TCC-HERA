import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',     
      alignItems: 'center',
      backgroundColor: '#FFF',
      height:"100%",
      
      
    },
    hera: {
      marginTop:"5%",
    },
    title:{
      fontFamily: "Bahnscrift",
      fontWeight: "700",
      fontSize: 30,
    },
    subtitle:{
      fontFamily: "Roboto",
      fontSize: 16,
      marginTop: 15,
      width: 272,
      textAlign: 'center',  
      color: "#6A6767",
      marginLeft: 52,
      marginRight: 51,
    },
    login:{
      position: 'absolute',
      marginLeft: 40,
      marginTop: 4,
      width:225,
      color:"#000"
      
    },
    cadastre:{
    
      marginTop: 18,
      
    },
    redes:{
      marginTop: 16,
      fontFamily: "Roboto",
      fontSize: 20,
      color: "#6A6767",
    },
    botoesRedes:{
      display: 'flex',
      flexDirection: 'row',     
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 201,
      marginBottom: 33
     
    },
    input:{
      marginTop: 20,
      
    
    },
    linha:{
      marginTop: -15,  
      marginBottom: -15,    
    },
    esqueceu:{
      width: 264,
      marginTop: 10,
      marginBottom: -8,
      color:"#6A6767"
    },
    btnlogin:{
      marginTop: 26,
      marginBottom: 99,
      
    },
    dtF:{
      position: 'absolute',
      marginTop: 16,
      width:265,
      textAlign: 'center',
      fontSize: 15,
      marginLeft:15,
      fontFamily: "Roboto",
      
    },
    textsenhaincorreta:{
      marginTop: 5, 
      color: "red", 
      display: "none"
    }
    
});

export default styles;