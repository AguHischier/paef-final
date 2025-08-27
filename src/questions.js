const QUESTIONS = [
    {
      id: "q1",
      risk: "red",
      timeLimit: 20,
      prompt:
        "¿Cuál es la tolerancia de alcohol en sangre permitida para conducir un automóvil particular en la Provincia de Santa Fe?",
      options: [
        { id: "a", text: "0,0 g/l (tolerancia cero)", correct: false },
        { id: "b", text: "0,2 g/l", correct: false },
        { id: "c", text: "0,5 g/l", correct: true },
      ],
      explanation:
        "La normativa provincial establece tolerancia de hasta 0,5 g/l para conductores particulares. El alcohol afecta reflejos y aumenta exponencialmente el riesgo de siniestros.",
      resources: [
        { title: "Informe ANSV Siniestralidad (2021)", url: "https://www.argentina.gob.ar/sites/default/files/2018/12/ansv_informe_siniestralidad-vial_fatal_2021_datos_preliminares.pdf" },
      ],
    },
    {
      id: "q2",
      risk: "yellow",
      timeLimit: 25,
      prompt:
        "Te aproximás a una bocacalle sin semáforo ni señalización. ¿Quién tiene prioridad de paso?",
      options: [
        { id: "a", text: "El que llega primero, sin importar el lado", correct: false },
        { id: "b", text: "El vehículo que se aproxima por la derecha", correct: true },
        { id: "c", text: "El de mayor tamaño", correct: false },
      ],
      explanation: "Ante ausencia de señalización, rige la prioridad de paso para quien circula por la derecha.",
      resources: [
        { title: "Manual del conductor - Santa Fe", url: "https://www.santafe.gov.ar/index.php/educacion/content/download/234217/1232006/file/Manual%20Conductor.pdf" },
      ],
    },
    {
      id: "q3",
      risk: "green",
      timeLimit: 20,
      prompt: "¿Qué indica la señal de tránsito de fondo azul con una 'P' blanca?",
      options: [
        { id: "a", text: "Prohibido estacionar", correct: false },
        { id: "b", text: "Estacionamiento permitido", correct: true },
        { id: "c", text: "Zona de carga y descarga", correct: false },
      ],
      explanation: "La señal azul con 'P' indica zona habilitada para estacionar.",
      resources: [],
    },
  
    
        {
          id: "q4",
          risk: "yellow",
          prompt: "¿Qué significa esta señal?",
          image: "https://www.santafe.gob.ar/examenlicencia/examenETLC/images/preguntas/a95c2d71610bc718f59f87c0095a5789c704bc92.jpg",
          options: [
            { id: "a", text: "Detención Cruce de caminos.", correct: false },
            { id: "b", text: "Cruce de varias vías férreas. Paso a nivel peligroso.", correct: true },
            { id: "c", text: "Puente ferroviario.", correct: false },
          ],
          explanation: "La señal indica cruce de varias vías férreas, advirtiendo un alto riesgo en la zona.",
          impactImage: "/images/impact/train_accident.jpg",
          resources: [{ title: "Ley 24.449 - Señalización ferroviaria", url: "https://www.argentina.gob.ar/normativa/nacional/ley-24449-76338/texto" }],
        },
        {
          id: "q5",
          risk: "red",
          prompt: "¿En caso de que un inspector de tránsito indique circular traspasando el semáforo en rojo?",
          options: [
            { id: "a", text: "Debe respetar la indicación de la autoridad de comprobación.", correct: true },
            { id: "b", text: "Debe respetar la señal de tránsito como corresponde.", correct: false },
            { id: "c", text: "Rige la norma legal en el caso particular.", correct: false },
          ],
          explanation: "La autoridad presente prevalece sobre la señalización vial en casos específicos.",
          impactImage: "/images/impact/red_light_accident.jpg",
          resources: [{ title: "Ley 24.449 - Autoridad de tránsito", url: "https://www.argentina.gob.ar/normativa/nacional/ley-24449-76338/texto" }],
        },
        {
          id: "q6",
          risk: "yellow",
          prompt: "¿Qué significa esta señal?",
          image: "https://www.santafe.gob.ar/examenlicencia/examenETLC/images/preguntas/027b8890a45d74fa189dddace2be93bcdb608860.jpg",
          options: [
            { id: "a", text: "Prohibido circular autos.", correct: false },
            { id: "b", text: "Precaución vía de un sólo carril.", correct: false },
            { id: "c", text: "Prohibido adelantarse.", correct: true },
          ],
          explanation: "La señal prohíbe adelantar en ese tramo, por riesgo de colisión frontal.",
          impactImage: "/images/impact/headon_collision.jpg",
          resources: [{ title: "ANSV - Señales reglamentarias", url: "https://www.argentina.gob.ar/seguridadvial" }],
        },
        {
          id: "q7",
          risk: "green",
          prompt: "¿A qué se denomina vías multicarriles?",
          options: [
            { id: "a", text: "Son aquellas que disponen de tres o más carriles por manos.", correct: false },
            { id: "b", text: "Son aquellas que disponen de dos o más carriles por mano.", correct: true },
            { id: "c", text: "Son aquellas que disponen de más de 5 carriles.", correct: false },
          ],
          explanation: "Una vía multicarril es aquella con al menos dos carriles por mano.",
          impactImage: "/images/impact/traffic.jpg",
          resources: [],
        },
        {
          id: "q8",
          risk: "red",
          prompt: "¿Qué condiciones facilitan la fatiga en el conductor?",
          options: [
            { id: "a", text: "Conducir muy despacio", correct: false },
            { id: "b", text: "Viajar sin acompañantes o pasajeros.", correct: false },
            { id: "c", text: "Disminuir descansos, monotonía, incomodidad, estado psicofísico no óptimo.", correct: true },
          ],
          explanation: "La fatiga incrementa el riesgo de accidente por distracción o somnolencia.",
          impactImage: "/images/impact/fatigue.jpg",
          resources: [{ title: "OMS - Seguridad vial y fatiga", url: "https://www.who.int/es" }],
        }
      ];
      
  
  export default QUESTIONS;
  