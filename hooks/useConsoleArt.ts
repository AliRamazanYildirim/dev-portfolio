import { useEffect } from "react";

export const useConsoleArt = () => {
    useEffect(() => {
        const ascii = `
                                          ÆÆÆÆÆÆÆÆÆÆÆÆÆÆ                                           
                                      ÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆ                                       
                                   ÆÆÆÆÆÆ                 ÆÆÆÆÆÆ                                    
                                 ÆÆÆÆ                         ÆÆÆÆ                                  
                               ÆÆÆÆ                             ÆÆÆÆ                                
                              ÆÆÆ                                 ÆÆÆÆ                              
                            ÆÆÆÆ                                    ÆÆÆ                             
                           ÆÆÆ                 ÆÆ                    ÆÆÆ                            
                          ÆÆÆ  ÆÆÆ          ÆÆÆÆÆÆ                    ÆÆÆ                           
                         ÆÆÆ ÆÆ Æ          ÆÆÆ  ÆÆ                     ÆÆÆ                          
                         ÆÆÆ Æ  ÆÆ Æ      Æ ÆÆ ÆÆÆ                     ÆÆÆ                          
                         ÆÆ Æ  ÆÆÆ Æ     ÆÆ ÆÆÆÆÆÆÆ ÆÆÆÆÆ ÆÆ  ÆÆ   ÆÆ ÆÆÆÆ                          
                        ÆÆÆÆÆÆÆÆÆÆÆÆ Æ   Æ ÆÆÆ  ÆÆÆÆÆÆ ÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆÆ                         
                        ÆÆÆÆÆ  Æ ÆÆ Æ     ÆÆÆÆ          Æ     ÆÆÆ        ÆÆ                         
                        ÆÆÆÆ   Æ            Æ ÆÆÆ             ÆÆÆ       ÆÆÆ                         
                        ÆÆÆ    Æ            Æ   ÆÆÆ          ÆÆ         ÆÆÆ                         
                         ÆÆ    Æ            Æ                           ÆÆ                          
                         ÆÆÆ                                           ÆÆÆ                          
                         ÆÆÆ                                           ÆÆÆ                          
                          ÆÆÆ                                         ÆÆÆ                           
                           ÆÆÆ                                       ÆÆÆ                            
                            ÆÆÆ                                     ÆÆÆ                             
                             ÆÆ Æ                                 ÆÆÆÆ                              
                               ÆÆÆ                              ÆÆÆÆÆ                               
                                    Æ                        Æ   ÆÆ                                 
                                   ÆÆ   Æ               ÆÆ   ÆÆ                                     
                                       ÆÆ    ÆÆÆ   Æ   ÆÆÆÆ                                         
                                        ÆÆ   ÆÆÆ   ÆÆ   Æ
    `;

        console.log(
            "%c " + ascii,
            "font-family: monospace; font-size: 8px; color: #fff; white-space: pre; line-height: 1.2;"
        );
        console.log("%cQualität spricht für sich.", "font-size:16px; font-weight:bold; color:#00ab6b;");
        if (typeof window !== "undefined") {
            const loginUrl = `${window.location.origin}/admin/login`;
            console.log(
                "%cSuchst du den Login-Bildschirm? 😄 Kluge Wahl, hier ist die Adresse aber nur für mich 😎",
                "font-size:12px; font-weight:bold; color:#c9184a;"
            );
            console.log(`%c${loginUrl}`, "font-size:14px; color:#00ab6b; text-decoration: underline;");
        }
    }, []);
};