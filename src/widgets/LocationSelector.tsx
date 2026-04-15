import { useTranslation } from "react-i18next";
import { changeUserInfo } from "@/redux/actions";
import { useAppDispatch, useAppSelector } from "@/redux/shared";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/ui/select";

const LocationSelector = () => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const { account, location, role } = useAppSelector(
		(state) => state.host.user,
	);

	const userInfo = useAppSelector((state) => state.host.userInfo);

	if (!userInfo || !account) return null;

	const availableLocations = (
		userInfo.external.accounts[account]?.locations || []
	).map((locationName) => ({
		value: locationName,
		text: locationName,
	}));

	const changeLocation = (newLocation: string) => {
		const newUserInfo = { account, role, location: newLocation };
		dispatch(changeUserInfo(newUserInfo));
		localStorage.setItem("user", JSON.stringify(newUserInfo));
	};

	return (
		<div className={"relative flex items-center gap-2"}>
			<span className="text-[var(--white)] hidden sm:block">
				{t("location")}:
			</span>
			<div>
				<Select value={location} onValueChange={changeLocation}>
					<SelectTrigger
						className={"py-1 bg-white w-28"}
						aria-label={t("location")}
					>
						<SelectValue>{location}</SelectValue>
					</SelectTrigger>

					<SelectContent>
						<SelectGroup>
							{availableLocations.map((currentLocation) => (
								<SelectItem
									value={currentLocation.value}
									key={currentLocation.value}
								>
									<span>{currentLocation.text}</span>
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
};

export default LocationSelector;
