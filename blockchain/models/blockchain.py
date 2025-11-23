import datetime
import hashlib
import json
import uuid

# Timezone fixo de Brasília
BRASILIA_TZ = datetime.timezone(datetime.timedelta(hours=-3))

class Blockchain:
    def __init__(self, loaded_state=None):
        # Valores padrão caso não exista estado salvo
        self.pending_data = []
        self.difficulty = 4
        self.min_batch_size = 2
        self.chain = []

        # Restaura o estado salvo do disco
        if loaded_state:
            self.chain = loaded_state.get("chain", [])
            self.pending_data = loaded_state.get("pending_data", [])
            self.difficulty = loaded_state.get("difficulty", 4)
            self.min_batch_size = loaded_state.get("min_batch_size", 2)

        # Cria bloco gênese se a chain estiver vazia
        if not self.chain:
            self.create_block(proof=1, previous_hash="0")

    # CRIAÇÃO DE BLOCO
    def create_block(self, proof, previous_hash):
        block = {
            "index": len(self.chain) + 1,
            "timestamp": str(datetime.datetime.now(BRASILIA_TZ)),
            "data": self.pending_data.copy(),
            "proof": proof,
            "previous_hash": previous_hash,
            "proof_difficulty": self.difficulty
        }

        # Limpa pendências após minerar
        self.pending_data = []
        self.chain.append(block)
        return block

    def print_previous_block(self):
        # Último bloco da cadeia
        return self.chain[-1]

    def add_data(self, data):
        # Reutiliza ID enviado ou cria um novo
        data_id = data.get("id") or str(uuid.uuid4())

        # Remove o campo id do payload original
        clean_data = {k: v for k, v in data.items() if k != "id"}

        # Registra o dado com timestamp de inserção
        data_with_id = {
            "id": data_id,
            "inserted_at": str(datetime.datetime.now(BRASILIA_TZ)),
            **clean_data
        }

        self.pending_data.append(data_with_id)
        return data_with_id

    # PROOF OF WORK
    def proof_of_work(self, previous_proof, previous_hash):
        new_proof = 1
        target = "0" * self.difficulty

        # Tenta até encontrar um hash válido
        while True:
            guess_str = f"{new_proof}-{previous_proof}-{previous_hash}"
            guess_hash = hashlib.sha256(guess_str.encode()).hexdigest()

            if guess_hash.startswith(target):
                return new_proof

            new_proof += 1

    def hash(self, block):
        # Hash do bloco inteiro para verificar integridade
        encoded = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded).hexdigest()

    # MINERAÇÃO
    def mine_block(self):
        previous = self.print_previous_block()
        prev_hash = self.hash(previous)
        proof = self.proof_of_work(previous["proof"], prev_hash)
        return self.create_block(proof, prev_hash)

    # VALIDAÇÃO
    def chain_valid(self, chain):
        if not chain:
            return False

        previous_block = chain[0]

        # Valida cada bloco contra o anterior
        for i in range(1, len(chain)):
            block = chain[i]

            # Confere hash anterior
            if block["previous_hash"] != self.hash(previous_block):
                return False

            # Usa a dificuldade do bloco minerado
            difficulty = block.get("proof_difficulty", 4)
            target = "0" * difficulty

            guess_str = (
                f"{block['proof']}-"
                f"{previous_block['proof']}-"
                f"{block['previous_hash']}"
            )
            guess_hash = hashlib.sha256(guess_str.encode()).hexdigest()

            if not guess_hash.startswith(target):
                return False

            previous_block = block

        return True

    # EXPORTAR ESTADO COMPLETO
    def export_state(self):
        # Usado para salvar tudo no state.json
        return {
            "chain": self.chain,
            "pending_data": self.pending_data,
            "difficulty": self.difficulty,
            "min_batch_size": self.min_batch_size
        }
