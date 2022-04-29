import express = require('express');

import { ResponseHelper } from '../../..';
import { CredentialsEntity } from '../../../databases/entities/CredentialsEntity';
import { CredentialRequest } from '../../../requests';
import { externalHooks } from '../../../Server';

import { middlewares } from '../../middlewares';
import {
	createCredential,
	encryptCredential,
	getCredentials,
	getSharedCredentials,
	removeCredential,
	sanitizeCredentials,
	saveCredential,
} from '../../services/credentials';

export = {
	createCredential: [
		async (
			req: CredentialRequest.Create,
			res: express.Response,
		): Promise<express.Response<Partial<CredentialsEntity>>> => {
			delete req.body.id; // delete if sent

			// TODO: handle nodesAccess

			const newCredential = await createCredential(req.body as Partial<CredentialsEntity>);

			const encryptedData = await encryptCredential(newCredential);

			Object.assign(newCredential, encryptedData);

			await externalHooks.run('credentials.create', [encryptedData]);

			const savedCredential = await saveCredential(newCredential, req.user);

			// LoggerProxy.verbose('New credential created', {
			// 	credentialId: newCredential.id,
			// 	ownerId: req.user.id,
			// });

			return res.json(sanitizeCredentials(savedCredential));
		},
	],
	deleteCredential: [
		async (
			req: CredentialRequest.Delete,
			res: express.Response,
		): Promise<express.Response<Partial<CredentialsEntity>>> => {
			const { id: credentialId } = req.params;
			let credentials: CredentialsEntity | undefined;

			if (req.user.globalRole.name !== 'owner') {
				const shared = await getSharedCredentials(req.user.id, credentialId, [
					'credentials',
					'role',
				]);

				if (shared && shared.role.name !== 'owner') {
					// LoggerProxy.info('Attempt to delete credential blocked due to lack of permissions', {
					// 	credentialId,
					// 	userId: req.user.id,
					// });
					return res.status(403).json({
						message: `Credential was not deleted because you are not the owner.`,
					});
				}
				credentials = shared?.credentials;
			} else {
				credentials = (await getCredentials(credentialId)) as CredentialsEntity;
			}

			if (!credentials) {
				return res.status(404).json({
					message: `Credential not found.`,
				});
			}

			// await externalHooks.run('credentials.delete', [credentialId]);

			await removeCredential(credentials);

			return res.json(sanitizeCredentials(credentials));
		},
	],
};
