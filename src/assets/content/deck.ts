// Assets
import profJoao from "../images/prof-joao.jpeg";
import profClara from "../images/profa-clara.jpeg";
import profRicardo from "../images/prof-ricardo.jpg";
import profMaria from "../images/prof-maria.jpeg";
import profPaulo from "../images/prof-paulo.jpeg";
import profRenata from "../images/profa-renata.jpeg";

// Types
import type { Card } from "../../types";

type Deck = {
  firstPlayer: Card[];
  secondPlayer: Card[];
};

export const deckContent: Deck = {
  firstPlayer: [
    {
      id: "a-prof-joao",
      teacher: "Prof. João",
      nickname: "O Didático",
      image: profJoao,
      attributes: {
        didatica: 92,
        carisma: 85,
        rigor: 78,
        prazos: 88,
        humor: 70,
      },
    },
    {
      id: "a-profa-clara",
      teacher: "Profa. Clara",
      nickname: "A Visionária",
      image: profClara,
      attributes: {
        didatica: 88,
        carisma: 95,
        rigor: 65,
        prazos: 72,
        humor: 80,
      },
    },
    {
      id: "a-prof-ricardo",
      teacher: "Prof. Ricardo",
      nickname: "O Cientista",
      image: profRicardo,
      attributes: {
        didatica: 75,
        carisma: 70,
        rigor: 90,
        prazos: 85,
        humor: 60,
      },
    },
  ],
  secondPlayer: [
    {
      id: "b-profa-maria",
      teacher: "Profa. Maria",
      nickname: "A Exigente",
      image: profMaria,
      attributes: {
        didatica: 80,
        carisma: 70,
        rigor: 95,
        prazos: 90,
        humor: 65,
      },
    },
    {
      id: "b-prof-paulo",
      teacher: "Prof. Paulo",
      nickname: "O Bem-Humorado",
      image: profPaulo,
      attributes: {
        didatica: 78,
        carisma: 88,
        rigor: 70,
        prazos: 75,
        humor: 95,
      },
    },
    {
      id: "b-profa-renata",
      teacher: "Profa. Renata",
      nickname: "A Estrategista",
      image: profRenata,
      attributes: {
        didatica: 85,
        carisma: 82,
        rigor: 88,
        prazos: 80,
        humor: 72,
      },
    },
  ],
};

export default deckContent;
