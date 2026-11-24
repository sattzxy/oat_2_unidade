import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Carona } from '../../models/carona.model';

// Componente filho reutilizável: mostra UMA carona.
// Recebe dados com input() e avisa o pai com output().
@Component({
  selector: 'app-carona-card',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './carona-card.html',
  styleUrl: './carona-card.css',
})
export class CaronaCard {
  // Dados que chegam do pai.
  carona = input.required<Carona>();
  co2Kg = input.required<number>();

  // Eventos que o filho manda para o pai (com o id da carona).
  concluir = output<number>();
  remover = output<number>();
}
