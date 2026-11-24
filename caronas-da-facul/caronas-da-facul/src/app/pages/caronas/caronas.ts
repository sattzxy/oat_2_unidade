import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CaronaCard } from '../../components/carona-card/carona-card';
import { Carona } from '../../models/carona.model';
import { CaronaService } from '../../services/carona.service';

// Tela principal: formulário para cadastrar e lista de caronas.
@Component({
  selector: 'app-caronas-page',
  imports: [FormsModule, CaronaCard],
  templateUrl: './caronas.html',
  styleUrl: './caronas.css',
})
export class CaronasPage {
  // O service guarda a lista; a tela só usa.
  protected readonly service = inject(CaronaService);

  // Campos do formulário, ligados com [(ngModel)].
  origem = '';
  destino = 'Universidade';
  horario = '';
  distanciaKm: number | null = null;
  passageiros: number | null = 1;

  erro = '';
  mensagem = '';

  adicionar(): void {
    this.mensagem = '';
    const origem = this.origem.trim();
    const destino = this.destino.trim();

    // Validação dos campos obrigatórios.
    if (!origem || !destino || !this.horario) {
      this.erro = 'Preencha origem, destino e horário.';
      return;
    }
    if (this.distanciaKm === null || this.distanciaKm <= 0) {
      this.erro = 'Informe uma distância maior que zero.';
      return;
    }
    if (this.passageiros === null || !Number.isInteger(this.passageiros) || this.passageiros < 1) {
      this.erro = 'Informe pelo menos 1 passageiro (número inteiro).';
      return;
    }

    this.service.adicionar({
      origem,
      destino,
      horario: this.horario,
      distanciaKm: this.distanciaKm,
      passageiros: this.passageiros,
    });

    this.erro = '';
    this.mensagem = 'Carona adicionada.';
    this.origem = '';
    this.horario = '';
    this.distanciaKm = null;
    this.passageiros = 1;
  }

  // Chamado quando o componente filho emite "concluir".
  aoConcluir(id: number): void {
    this.service.concluir(id);
    this.erro = '';
    this.mensagem = 'Carona concluída. Veja o CO₂ evitado em "Meu impacto".';
  }

  // Chamado quando o componente filho emite "remover".
  aoRemover(id: number): void {
    this.service.remover(id);
    this.erro = '';
    this.mensagem = 'Carona removida.';
  }

  co2De(carona: Carona): number {
    return this.service.calcularCo2(carona);
  }
}
