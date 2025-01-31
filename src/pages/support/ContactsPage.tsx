import { fetchContacts } from "@/redux/actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import type { Langs } from "@/shared/translations/i18n";
import Loader from "@/shared/ui/loader";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const ContactsPage = () => {
	const { t, i18n } = useTranslation();

	const user = useAppSelector((state) => state.host.user);
	const contacts = useAppSelector((state) => state.host.contacts);
	const contactsFetchStatus = useAppSelector(
		(state) => state.host.contactsFetchStatus,
	);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchContacts(i18n.language as Langs));
	}, [user.account, user.location, user.role, i18n.language]);

	if (contactsFetchStatus === "pending") {
		return <Loader />;
	}

	return (
		<div className="contacts-page helpdesk-content">
			<h1>{t("contactsTitle")}</h1>
			{contacts?.map((contact, key) => (
				<div key={key} className="contact-item">
					<b>{contact.kind}</b>
					{contact.value?.split(",").map((value, key) => (
						<p key={key}>{value}</p>
					))}
					<p>{contact.comment}</p>
				</div>
			))}
		</div>
	);
};

export default ContactsPage;
