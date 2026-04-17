#include <iostream>
#include <windows.h>
#include <mmsystem.h>
#include <cmath>
#include <cctype>
#include <iomanip>
#include <thread>
#include <chrono>
using namespace std;
void lerlocalizacao(double &lat, double &longi, string msg){
    char dadosll;
    do{
        cout << msg;
        cin >> lat >> longi;
        cout << "Latitude: " << lat << "\nLongitude: " << longi << "\nDados corretos? Y/N\n";
        cin >> dadosll;
    }while(toupper(dadosll)=='N');  
}
void calcdistancia(double &distanc, double deltlat, double deltlong){
    distanc = (sqrt(pow(deltlat, 2)+pow(deltlong, 2)))*111000;
}
void verific(bool &tadentro, double distanc, double limite){
    tadentro = (distanc <= limite);
}
void trespontos(){
    for(int i = 0;i<3;i++){
        this_thread::sleep_for(chrono::milliseconds(800));
        cout << ". ";
    }
}
int main(){
    double latatual, longatual, latdest, longdest, distanc, deltlat, deltlong;
    char dadosraio;
    int metrosaviso;
    bool alert = false, tadentro = false;
    //LOCALIZACAO USUARIO
    lerlocalizacao(latatual, longatual, "Insira sua latitude e longitude: \n");
    //DESTINO USUARIO
    lerlocalizacao(latdest, longdest, "Insira a latitude e longitude do destino: \n");
    //RAIO DE ATIVACAO
    do{
        cout << "Voce deseja ser avisado em quantos metros?(Use apenas valores inteiros) \n";
        cin >> metrosaviso;
        cout << "Voce quer ser avisado com: " << metrosaviso << "metros do local, correto? Y/N\n";
        cin >> dadosraio;
    }while(toupper(dadosraio)=='N');
    cout << "Calculando proximidade ";
    trespontos();
    cout << endl;
    //ATIVACAO DO SOM
    do{
        deltlat = (latatual-latdest);
        deltlong = (longatual-longdest);
        calcdistancia(distanc, deltlat, deltlong);
        verific(tadentro, distanc, metrosaviso);
        cout << fixed << setprecision(2) << "Voce esta a aproximadamente " << distanc << " metros de distancia" << endl;
        if(tadentro){
            cout << "Destino alcançado" << endl;
            PlaySound("som_alarme.wav", NULL, SND_FILENAME | SND_SYNC);
            alert = true;
        }else{
            cout << "Atualizando localizacao ";
            trespontos();
            cout << endl;
            latatual += (latdest > latatual ? 0.0001 : -0.0001);
            longatual += (longdest > longatual ? 0.0001 : -0.0001);
            this_thread::sleep_for(chrono::seconds(5));
        }    
    }while(!alert);
}
