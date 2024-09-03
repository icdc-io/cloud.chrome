import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from "semantic-ui-react";
import { fetchContacts } from "../../redux/actions";

const ContactsPage = () => {
  const { t, i18n } = useTranslation();

  const user = useSelector((state) => state.host.user);
  const contacts = useSelector((state) => state.host.contacts);
  const contactsFetchStatus = useSelector(
    (state) => state.host.contactsFetchStatus,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchContacts(i18n.language));
  }, [user.account, user.location, user.role, i18n.language]);

  if (!contactsFetchStatus || contactsFetchStatus === "pending") {
    return <Loader active inline="centered" />;
  }

  return (
    <div className="helpdesk-content">
      <h1>{t("contactsTitle")}</h1>
      {contacts?.map((contact, key) => (
        <div key={key} className="contact-item">
          <b>{contact.kind}</b>
          {contact.value.split(",").map((value, key) => (
            <p key={key}>{value}</p>
          ))}
          <p>{contact.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ContactsPage;
