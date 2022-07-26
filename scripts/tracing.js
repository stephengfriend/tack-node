const { credentials, Metadata } = require('@grpc/grpc-js')
const {
	getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node')
const {
	CollectorTraceExporter,
} = require('@opentelemetry/exporter-collector-grpc')
const { Resource } = require('@opentelemetry/resources')
const ot = require('@opentelemetry/sdk-node')
const {
	SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions')
const process = require('process')

const metadata = new Metadata()
metadata.set('x-honeycomb-team', 'e2f61fedbcd5a379d915aef9e742bd1f')
metadata.set('x-honeycomb-dataset', 'sandbox')

const traceExporter = new CollectorTraceExporter({
	url: 'grpc://api.honeycomb.io:443/',
	credentials: credentials.createSsl(),
	metadata,
})

// const traceExporter = new ot.tracing.ConsoleSpanExporter()

const sdk = new ot.NodeSDK({
	resource: new Resource({
		[SemanticResourceAttributes.SERVICE_NAME]: 'tack',
	}),
	traceExporter,
	instrumentations: [getNodeAutoInstrumentations()],
})

process.on('SIGTERM', () => {
	sdk
		.shutdown()
		.then(() => console.info('Tracing terminated'))
		.catch((error) => console.error('Error terminating tracing', error))
		.finally(() => process.exit(0))
})

sdk
	.start()
	.then(() => console.info('Tracing initialized'))
	.catch((error) => console.error('Error initializing tracing', error))
