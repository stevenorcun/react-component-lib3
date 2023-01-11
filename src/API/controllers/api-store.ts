/* eslint-disable import/prefer-default-export */
import AuthApi from './auth-api';
import CasesApi from './cases-api';
import ChatApi from './chat-api';
import NotificationsApi from './notifications-api';
import ObjectsApi from './object-api';
import FavoritesApi from './favorite-api';
import FilesApi from './files-api';
import PingApi from './ping-api';
import SearchApi from './search-api';
import SubscriptionsApi from './subscriptions-api';
import MarkingsApi from './markings-api';
import ListsApi from './lists-api';
import SearchQueriesApi from './search-queries-api';
import UsersApi from './users-api';
import PersonalizationApi from './personalization-api';
import OntologyApi from './ontology-api';
import OntologySettingsApi from './ontology-settings-api';
import ApplicativeApi from './applicative-api';

export const ApiStore: unknown = {
  AuthApi,
  CasesApi,
  ChatApi,
  NotificationsApi,
  ObjectsApi,
  FavoritesApi,
  FilesApi,
  MarkingsApi,
  PingApi,
  SearchApi,
  SubscriptionsApi,
  ListsApi,
  SearchQueriesApi,
  UsersApi,
  PersonalizationApi,
  OntologySettingsApi,
  OntologyApi,
  ApplicativeApi,
};
