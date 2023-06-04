import { z } from 'zod';
import { log, config as rawConf } from 'auriserve';
import MailComposer from 'nodemailer/lib/mail-composer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';

const schema = z.object({
	sendmail: z.object({
		host: z.string(),
		port: z.coerce.number(),
		user: z.string(),
		pass: z.string(),
		ssl: z.boolean().default(true)
	})
});

const conf = schema.parse(rawConf) as z.infer<typeof schema>;

interface EmailConfig {
	to: string | string[];
	subject: string;
	content: string;
	replyTo?: string;
}

export async function sendMail(opt: EmailConfig) {
	log.debug('Connecting to SMTP server...');

	const [ conn, [ envelope, body ] ] = await Promise.all([
		(async () => {
			const conn = new SMTPConnection({
				host: conf.sendmail.host,
				port: conf.sendmail.port,
				secure: conf.sendmail.ssl,
			});

			await new Promise<void>((res, rej) => conn.connect(
				(err) => { if (err) rej(err); else res(); }));
			await new Promise<void>((res, rej) => conn.login({ user: conf.sendmail.user, pass: conf.sendmail.pass },
				(err) => { if (err) rej(err); else res(); }));

			log.debug('Connected to SMTP server.');

			conn.once('end', () => {
				log.debug('Disconnected from SMTP server.');
			});

			return conn;
		})(),
		(async () => {
			const mailComposer = new MailComposer({
				html: opt.content,
				bcc: opt.to,
				subject: opt.subject,
				replyTo: opt.replyTo,
				from: conf.sendmail.user,
			});

			const mail = mailComposer.compile();

			const envelope = mail.getEnvelope();
			const body = await new Promise((res, rej) => mail.build(
				(err, msg) => { if (err) rej(err); else res(msg); })) as Buffer;

			return [ envelope, body ];
		})()
	]);

	await new Promise<void>((res, rej) => conn.send(envelope, body,
		(err) => { if (err) rej(err); else res(); }));

	log.debug('Sent mail to \'%s\' with subject \'%s\'.', opt.to, opt.subject);
	conn.close();
}
