<template>
    <div 
        class="menu-flotante menu-flotante-derecho menu-accesibilidad" 
        :class="{abierto: estaAbierto}"
    >
        <button
            class="menu-flotante-boton"
            :aria-labelledby="$t('components.accessibilityButton.tools')"
            aria-controls="menua11y"
            :aria-expanded="estaAbierto"
            @click="estaAbierto = !estaAbierto"
            type="button"
            :aria-label="$t('components.accessibilityButton.openMenu')"
        >
            <span class="pictograma-accesibilidad" aria-hidden="true" />
        </button>
        <div 
            class="menu-flotante-contenedor" 
            id="menua11y"
            :aria-hidden="!estaAbierto"
        >
            <p id="herramientasaccesibilidad" class="menu-flotante-titulo">
                {{ $t('components.accessibilityButton.tools') }}
            </p>
            <button 
                :class="['boton-opcion', { 'boton-activo': settings.tipografia }]" 
                @click="alternarTipografiaAccesible"
            >
                <span aria-hidden="true" class="pictograma-cambio-tipografia"></span>
                {{ $t('components.accessibilityButton.fontChange') }}
            </button>
            <button 
                :class="['boton-opcion', { 'boton-activo': settings.hipervinculos }]" 
                @click="alternarEnlacesSubrayados"
            >
                <span aria-hidden="true" class="pictograma-enlace-subrayado"></span>
                {{ $t('components.accessibilityButton.underlineLinks') }}
            </button>
            <button 
                :class="['boton-opcion', { 'boton-activo': settings.simplificada }]" 
                @click="alternarVistaSimplificada"
            >
                <span aria-hidden="true" class="pictograma-vista-simplificada"></span>
                {{ $t('components.accessibilityButton.textOnly') }}
            </button>
            <button 
                :class="['boton-opcion', { 'boton-activo': settings.oscura }]" 
                @click="alternarVistaOscura"
            >
                <span aria-hidden="true" class="pictograma-contraste"></span>
                {{ $t('components.accessibilityButton.darkView') }}
            </button>
            
            <button 
                class="boton-secundario boton-chico m-t-2" 
                type="button"
                @click="resetSettings"
            >
                {{ $t('components.accessibilityButton.reset') }}
            </button>
            <!-- Selector de idioma -->
            <div class="menu-flotante-seccion">
                <label for="idioma-select" class="menu-flotante-label">
                    {{ $t('components.accessibilityButton.language') }}
                </label>
                <select id="idioma-select" v-model="$i18n.locale" class="menu-flotante-select">
                    <option value="es-MX">Español</option>
                    <option value="en-US">English</option>
                </select>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            estaAbierto: false,
            settings: JSON.parse(localStorage.getItem('accessibilitySettings')) || {
                tipografia: false,
                hipervinculos: false,
                simplificada: false,
                oscura: false
            }
        };
    },
    mounted() {
        // Aplicar configuraciones guardadas al cargar el componente
        Object.keys(this.settings).forEach(setting => {
            document.body.classList.toggle(`a11y-${setting}`, this.settings[setting]);
        });
    },
    watch: {
        settings: {
            handler(newSettings) {
                localStorage.setItem('accessibilitySettings', JSON.stringify(newSettings));
            },
            deep: true
        }
    },
    methods: {
        alternarTipografiaAccesible() {
            this.settings.tipografia = !this.settings.tipografia;
            document.body.classList.toggle('a11y-tipografia', this.settings.tipografia);
        },
        alternarEnlacesSubrayados() {
            this.settings.hipervinculos = !this.settings.hipervinculos;
            document.body.classList.toggle('a11y-hipervinculos', this.settings.hipervinculos);
        },
        alternarVistaSimplificada() {
            this.settings.simplificada = !this.settings.simplificada;
            document.body.classList.toggle('a11y-simplificada', this.settings.simplificada);
        },
        alternarVistaOscura() {
            this.settings.oscura = !this.settings.oscura;
            document.body.classList.toggle('a11y-oscura', this.settings.oscura);
        },
        resetSettings() {
            this.settings = {
                tipografia: false,
                hipervinculos: false,
                simplificada: false,
                oscura: false
            };
            // Remover todas las clases de accesibilidad del body
            document.body.classList.remove(
                'a11y-tipografia',
                'a11y-hipervinculos',
                'a11y-simplificada',
                'a11y-oscura'
            );
        }
    }
};
</script>

<style>
/* Estilos generales */
.menu-flotante {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 99999999;
}

.boton-opcion {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #f8f8f8;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.boton-opcion:hover {
    background-color: #e0e0e0;
}

.boton-activo {
    background-color: #007bff !important;
    color: white !important;
    border-color: #007bff !important;
}

/* Tipografía accesible */
.a11y-tipografia {
    font-family: 'OpenDyslexic', 'Comic Sans MS', 'Arial', sans-serif !important;
    line-height: 1.5 !important;
    letter-spacing: 0.05em !important;
    word-spacing: 0.1em !important;
}

/* Enlaces subrayados */
.a11y-hipervinculos a,
.a11y-hipervinculos .q-link {
    text-decoration: underline !important;
}

/* Vista simplificada */
.a11y-simplificada {
    filter: grayscale(100%) !important;
}

.a11y-simplificada button,
.a11y-simplificada input,
.a11y-simplificada select {
    border: 2px solid #000 !important;
    background-color: #f8f8f8 !important;
    color: #000 !important;
}

/* Modo oscuro */
.a11y-oscura {
    background-color: #222 !important;
    color: #eee !important;
}

.a11y-oscura .q-page,
.a11y-oscura .q-layout,
.a11y-oscura .q-card {
    background-color: #2a2a2a !important;
    color: #ddd !important;
}

.a11y-oscura input,
.a11y-oscura select,
.a11y-oscura button {
    background-color: #333 !important;
    color: #fff !important;
    border: 1px solid #666 !important;
}

.a11y-oscura a {
    color: #00bfff !important;
    text-decoration: underline !important;
}

</style>
