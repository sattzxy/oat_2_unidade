import { DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CaronaService, FATOR_CO2_KG_POR_KM } from '../../services/carona.service';

// Segunda tela: mostra o impacto e a meta semanal (diferencial criativo).
@Component({
  selector: 'app-impacto-page',
  imports: [FormsModule, DecimalPipe, RouterLink],
  templateUrl: './impacto.html',
  styleUrl: './impacto.css',
})
export class ImpactoPage {
  protected readonly service = inject(CaronaService);
  protected readonly fator = FATOR_CO2_KG_POR_KM;

  // Campo da meta, ligado com [(ngModel)]. Começa com a meta já salva.
  metaDigitada: number | null = this.service.metaSemanalKg();
  erro = '';
  mensagem = '';

  salvarMeta(): void {
    if (this.metaDigitada === null || this.metaDigitada <= 0) {
      this.erro = 'A meta precisa ser maior que zero.';
      this.mensagem = '';
      return;
    }
    this.service.definirMeta(this.metaDigitada);
    this.erro = '';
    this.mensagem = 'Meta atualizada.';
  }

  // Frase de incentivo conforme o progresso da semana.
  get incentivo(): string {
    const p = this.service.progressoMetaPercent();
    if (this.service.concluidasNaSemana().length === 0) return 'Conclua uma carona para começar a contar a semana.';
    if (p >= 100) return 'Meta batida! Esta semana você já evitou o CO₂ que planejou.';
    if (p >= 50) return 'Mais da metade! Mais uma carona e você chega lá.';
    return 'Bom começo. Cada carona conta.';
  }
}
