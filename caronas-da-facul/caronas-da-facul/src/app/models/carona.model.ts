// Modelo de dados: descreve como é uma carona.
export interface Carona {
  id: number;
  origem: string;
  destino: string;
  horario: string;        // data e hora no formato do input datetime-local
  distanciaKm: number;    // distância do trajeto, em km
  passageiros: number;    // quantas pessoas vão junto (sem contar o motorista)
  concluida: boolean;
  concluidaEm: string | null; // data ISO de quando foi concluída (usada na meta semanal)
}
