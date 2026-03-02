import React, { useEffect, useState } from "react";
import {
  Box,
  Center,
  FlatList,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import {
  Linking,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

type NewsItem = {
  id: number;
  image: string | null;
  source: string;
  datetime: number;
  headline: string;
  url: string;
};

const API_KEY = process.env.EXPO_PUBLIC_FINNHUB_API_KEY ?? "";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const NewsFeedScreen = () => {
  const [data, setData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError("");
        if (!API_KEY) {
          setError("Missing API key. Add EXPO_PUBLIC_FINNHUB_API_KEY to .env");
          return;
        }
        const res = await fetch(
          `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`,
        );
        if (!res.ok) {
          throw new Error("Failed to fetch news");
        }
        const json = (await res.json()) as NewsItem[];
        setData(json);
      } catch (e) {
        setError("Unable to load news. Pull to refresh or try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const renderItem = ({ item }: { item: NewsItem }) => {
    const date = new Date(item.datetime * 1000);
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => Linking.openURL(item.url)}
        style={styles.cardTouchable}
      >
        <Box style={styles.card}>
          <HStack space="md" alignItems="flex-start">
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                alt={item.headline}
                w={100}
                h={100}
                borderRadius="$md"
                style={styles.cardImage}
              />
            ) : (
              <Box style={styles.cardImagePlaceholder}>
                <Text color="$coolGray500" fontSize="$xs">
                  No image
                </Text>
              </Box>
            )}
            <VStack flex={1} space="xs" style={styles.cardContent}>
              <Text fontSize="$xs" color="$coolGray500">
                {formatDate(date)}
              </Text>
              <Text fontSize="$xs" color="$coolGray500" fontWeight="$medium">
                {item.source}
              </Text>
              <Text
                fontWeight="$bold"
                fontSize="$sm"
                color="$black"
                numberOfLines={3}
                lineHeight={20}
              >
                {item.headline}
              </Text>
              <Text fontSize="$xs" color="#0ea5e9" style={styles.readMore}>
                Read More
              </Text>
            </VStack>
          </HStack>
        </Box>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <Center flex={1} bg="$white">
        <Spinner color="#0ea5e9" />
      </Center>
    );
  }

  return (
    <Box flex={1} bg="$white">
      <Box px="$5" pt="$12" pb="$4">
        <Text fontSize="$3xl" fontWeight="$bold" color="$black">
          News Feed
        </Text>
        {error ? (
          <Text color="$red500" mt="$2" fontSize="$sm">
            {error}
          </Text>
        ) : null}
      </Box>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  cardTouchable: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  cardImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
  },
  readMore: {
    textDecorationLine: "underline",
    marginTop: 4,
  },
});
