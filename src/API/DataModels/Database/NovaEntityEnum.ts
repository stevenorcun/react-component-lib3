export enum NovaEntityType {
  PhysicalPerson = 1, // [OBJET > Entités] Personne physique
  LegalPerson, // [OBJET > Entités] Personne morale
  Case, // [OBJET > Entités] Affaire
  File, // [OBJET > Entités] Fichier
  Document, // [ENREGISTREMENT > Document] Document (ex : une retranscription d'une communication entre 2 personnes)
  Warrant, // [OBJET > Entités] Mandat judiciaire
  Requisition, // [OBJET > Entités] Réquisition
  Vehicle, // [OBJET > Entités] Véhicule
  VirtualIdentity, // [OBJET > Entités] Identité virtuelle
  AttachedFile, // [ENREGISTREMENT > Document] Pièces jointe
  InternalMail, // [ENREGISTREMENT > Document] Mail interne
  Note, // [ENREGISTREMENT > Document] Note
  Phone, // [OBJET > Entités] Téléphone
  MobilePhone, // [OBJET > Entités] Téléphone portable
  SharedGraph, // [ARTEFACT] Graphe partagé
  List, // [ARTEFACT] Liste
  WrittenDocument, // [ARTEFACT] Document rédacteur (ce qui sort de l'app note de l'utilisateur)
  Minutes, // [ENREGISTREMENT > Document] Procès verbal
  AirPlaneTravel, // [OBJET > Évènement] Vol en avion
  CarAccident, // [OBJET > Évènement] Accident de voiture
  Attack, // [OBJET > Évènement] Attaque
  AtmRobbery, // [OBJET > Évènement] Vol ATM (DAB)
  MailAddress, // [OBJET > Entités] Adresse mail
  IpAddress, // [OBJET > Entités] Adresse Ip
  Picture, // [OBJET > multimediaFile] Photo
  Video, // [OBJET > multimediaFile] Vidéo
  Email, // [OBJET > Document]
  InformationNote, // [OBJET > Document] Note de renseignement
  PersonalNameRecord, // [OBJET > Document] PNR
  MailActivity, // [OBJET > RecentActivity] Mail activité récente
  InformationNoteActivity, // [OBJET > RecentActivity] Note d'information activité récente
  PersonalNameRecordActivity, // [OBJET > RecentActivity] PNR Activité récente
}

/**
 * Generic groups of `NovaEntityType`
 * Used when regrouping types in the search result filters, on the left
 */
export enum NovaEntityTypeGroup {
  Entities = 1, // [OBJET]
  Events, // [OBJET]
  Artefacts, // [ARTEFACT]
  Documents, // [ENREGISTREMENT]
  MultimediaFiles, // [OBJET]
  RecentActivities, // [OBJET]
}

/**
 * Gender of a `NovaEntityType.PhysicalPerson`
 * Used to display different fallback icons
 */
export enum NovaEntityGender {
  Male = 1,
  Female,
}

/**
 * Tags associated to `NovaEntityType.PhysicalPerson`
 */
export enum NovaEntityTag {
  Judiciary = 1,
  Known,
  Deceased,
}

export enum NovaEntityConnexionType {
  InvolvedIn = 1,
  LinkedTo,
  MarriedTo,
  UserOf,
  HolderOf,
}
