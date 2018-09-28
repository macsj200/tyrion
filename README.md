# Offline Signing Tool
            xxxxxxx                 mmmmmmmmmmmm               
           xxx   xxx               mmm        mmm              
      xxxxxxx     xxxxxxx         mm            mm             
      xx   xxx   xxx   xx         mm            mm             
     xx     xxxxxxx     xx       mm              mm            
      xx   xxxxxxxxx   xx        mm              mm            
       xxxxx xxxxx xxxxx         mm              mm            
             xxxxx               mm              mm            
             xxxxx              UUUUUUUUUUUUUUUUUUUU           
             xxxxx              UUUUUUUUUUUUUUUUUUUU           
             xxxxx              UUUUUUUUU   UUUUUUUU           
             xxxxx              UUUUUUUU     UUUUUUU           
             xxxxx              UUUUUUUUU   UUUUUUUU           
             xxxxx               UUUUUUUI   IUUUUUU            
             xxxxx               UUUUUUUI   IUUUUUU            
          xxxxxxxx                UUUUUUUuuuUUUUUU             
          xxxxxxxx                 UUUUUUUUUUUUUU              
             xxxxx                                             
          xxxxxxxx          
          xxxxxxxx                                                       
             xxxxx                                       
## About
This tool lets the user sign bitcoin transactions (sig hashes) without sending private keys.
## Methodology
The offline signing tool is secured using a two-tiered threat model. The first level corresponds to the sighash payload downloaded from lannister, and the second is concerned with the distribution of the offline signing tool itself.

Essentially, there are two attack vectors:
1. An attacker forges sighashes to trick the seller into signing a bogus transaction
2. An attacker forges the offline signing tool and modifies the source code. The attacker then exploits attack vector 1.

![Vector 1](vector1.png)
![Vector 2](vector2.png)
## Development link
[Link to development version](https://titan-digital-exchange.github.io/offline-signing-tool/)
## Instructions
1. Navigate to [development URL](http://titan-digital-exchange.github.io/offline-signing-tool) or spin up the app with `yarn start` (after cloning 
of course with `git clone git@github.com:titan-digital-exchange/offline-signing-tool.git`)
2. Input your [WIF](https://en.bitcoin.it/wiki/Wallet_import_format)
3. Upload your Sig Hashes file (obtained from [lannister-beta](https://lannister-beta.herokuapp.com/))
4. Press sign
5. Press download
6. Input signed hashes to lannister

## Getting started
### Development
1. `yarn install`
2. `yarn start`
3. (optional) `yarn run electron`
## Protocol
![Protocol](ost.png)

## TODO
- Productionize a la [this article](https://medium.freecodecamp.org/building-an-electron-application-with-create-react-app-97945861647c)