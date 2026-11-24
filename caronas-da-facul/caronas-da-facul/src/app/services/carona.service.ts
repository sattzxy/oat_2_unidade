import { Injectable, computed, signal } from '@angular/core';
import { Carona } from '../models/carona.model';

// Chaves usadas no localStorage. É o "nome da gaveta" onde guardamos cada dado.
const CHAVE_CARONAS = 'caronas-da-facul:caronas';
const CHAVE_META = 'caronas-da-facul:meta-semanal';

// Estimativa média: um carro de passeio emite cerca de 0,12 kg de CO2 por km.
// É uma ESTIMATIVA, não uma medição exata.
export const FATOR_CO2_KG_POR_KM = 0.12;

// Meta semanal padrão, em kg de CO2 evitado.
const META_PADRAO_KG = 5;

@Injectable({ providedIn: 'root' })
export class CaronaService {
  // Lista de caronas. Usamos signal: quando ela muda, as telas se atualizam sozinhas.
  private readonly _caronas = signal<Carona[]>([]);
  private readonly _metaSemanalKg = signal<number>(META_PADRAO_KG);

  // Versões somente leitura, para os componentes não alterarem a lista direto.
  readonly caronas = this._caronas.asReadonly();
  readonly metaSemanalKg = this._metaSemanalKg.asReadonly();

  // ---- Valores calculados (diferencial criativo) ----
  readonly concluidas = computed(() => this._caronas().filter((c) => c.concluida));

  readonly totalCo2Kg = computed(() =>
    this.concluidas().reduce((soma, c) => soma + this.calcularCo2(c), 0)
  );

  readonly concluidasNaSemana = computed(() => {
    const inicio = this.inicioDaSemana().getTime();
    return this.concluidas().filter(
      (c) => c.concluidaEm !== null && new Date(c.concluidaEm).getTime() >= inicio
    );
  });

  readonly co2SemanaKg = computed(() =>
    this.concluidasNaSemana().reduce((soma, c) => soma + this.calcularCo2(c), 0)
  );

  readonly progressoMetaPercent = computed(() => {
    const meta = this._metaSemanalKg();
    if (meta <= 0) return 0;
    return Math.min(100, Math.round((this.co2SemanaKg() / meta) * 100));
  });

  readonly totalPassageiros = computed(() =>
    this.concluidas().reduce((soma, c) => soma + c.passageiros, 0)
  );

  constructor() {
    // Ao abrir a aplicação, o service é criado e já carrega os dados salvos.
    this.carregar();
  }

  // ---- Ações da lista ----
  adicionar(dados: Omit<Carona, 'id' | 'concluida' | 'concluidaEm'>): void {
    const nova: Carona = { ...dados, id: Date.now(), concluida: false, concluidaEm: null };
    this._caronas.update((lista) => [nova, ...lista]);
    this.salvar();
  }

  concluir(id: number): void {
    this._caronas.update((lista) =>
      lista.map((c) =>
        c.id === id && !c.concluida
          ? { ...c, concluida: true, concluidaEm: new Date().toISOString() }
          : c
      )
    );
    this.salvar();
  }

  remover(id: number): void {
    this._caronas.update((lista) => lista.filter((c) => c.id !== id));
    this.salvar();
  }

  definirMeta(kg: number): void {
    this._metaSemanalKg.set(kg);
    this.salvar();
  }

  // CO2 evitado = distância x passageiros x fator de emissão.
  calcularCo2(c: Carona): number {
    return c.distanciaKm * c.passageiros * FATOR_CO2_KG_POR_KM;
  }

  // Segunda-feira da semana atual, às 00:00.
  private inicioDaSemana(): Date {
    const hoje = new Date();
    const diasDesdeSegunda = (hoje.getDay() + 6) % 7;
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - diasDesdeSegunda);
    return inicio;
  }

  // ---- PERSISTÊNCIA ----
  // TODO (dupla): reescrevam estes comentários com as palavras de vocês.

  // SALVAR: transforma a lista em texto (JSON.stringify) e guarda no localStorage.
  // É chamado depois de toda mudança (adicionar, concluir, remover, mudar meta).
  private salvar(): void {
    try {
      localStorage.setItem(CHAVE_CARONAS, JSON.stringify(this._caronas()));
      localStorage.setItem(CHAVE_META, JSON.stringify(this._metaSemanalKg()));
    } catch (erro) {
      console.error('Não foi possível salvar os dados.', erro);
    }
  }

  // CARREGAR: lê o texto guardado no localStorage e converte de volta para objetos
  // (JSON.parse). Se não houver nada salvo ou o texto estiver quebrado, usa valores iniciais.
  private carregar(): void {
    try {
      const textoCaronas = localStorage.getItem(CHAVE_CARONAS);
      if (textoCaronas) {
        const lista = JSON.parse(textoCaronas);
        if (Array.isArray(lista)) {
          this._caronas.set(lista as Carona[]);
        }
      }
      const textoMeta = localStorage.getItem(CHAVE_META);
      if (textoMeta) {
        const meta = Number(JSON.parse(textoMeta));
        if (Number.isFinite(meta) && meta > 0) {
          this._metaSemanalKg.set(meta);
        }
      }
    } catch (erro) {
      console.error('Dados salvos inválidos. Começando do zero.', erro);
    }
  }
}
