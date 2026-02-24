import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import { Spell, SchoolColors } from '@/types/spell';
import { X, Clock, Target, Zap, Timer, BookOpen, Users } from 'lucide-react-native';

interface SpellDetailModalProps {
  spell: Spell | null;
  visible: boolean;
  onClose: () => void;
}

function FormattedText({ text }: { text: string }) {
  const { width } = useWindowDimensions();

  return (
    <RenderHtml
      contentWidth={width - 40}
      source={{ html: text }}
      tagsStyles={{
        body: {
          color: '#333',
          fontSize: 16,
          lineHeight: 24,
        },
        p: {
          marginBottom: 12,
        },
        ul: {
          marginVertical: 8,
          paddingLeft: 20,
        },
        li: {
          marginBottom: 8,
        },
        strong: {
          fontWeight: '700',
          color: '#1A1A1A',
        },
        em: {
          fontStyle: 'italic',
          color: '#444',
        },
      }}
    />
  );
}

export function SpellDetailModal({ spell, visible, onClose }: SpellDetailModalProps) {
  if (!spell) return null;

  const schoolColor = SchoolColors[spell.school as keyof typeof SchoolColors];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, { backgroundColor: schoolColor }]}>
          <View style={styles.headerContent}>
            <View style={styles.titleSection}>
              <Text style={styles.spellName}>{spell.name}</Text>
              <Text style={styles.schoolLevel}>
                {spell.school} • Nível {spell.level}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Clock size={20} color={schoolColor} />
                <Text style={styles.statLabel}>Tempo de Conjuração</Text>
                <Text style={styles.statValue}>{spell.castingTime}</Text>
              </View>
              <View style={styles.statItem}>
                <Target size={20} color={schoolColor} />
                <Text style={styles.statLabel}>Alcance</Text>
                <Text style={styles.statValue}>{spell.range}</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Zap size={20} color={schoolColor} />
                <Text style={styles.statLabel}>Componentes</Text>
                <Text style={styles.statValue}>{spell.components}</Text>
              </View>
              <View style={styles.statItem}>
                <Timer size={20} color={schoolColor} />
                <Text style={styles.statLabel}>Duração</Text>
                <Text style={styles.statValue}>{spell.duration}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BookOpen size={20} color={schoolColor} />
              <Text style={[styles.sectionTitle, { color: schoolColor }]}>
                Descrição
              </Text>
            </View>
            <FormattedText text={spell.description} />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={20} color={schoolColor} />
              <Text style={[styles.sectionTitle, { color: schoolColor }]}>
                Classes
              </Text>
            </View>

            <View style={styles.classesContainer}>
              {spell.classes.map((className, index) => (
                <View key={index} style={[styles.classBadge, { borderColor: schoolColor }]}>
                  <Text style={[styles.classText, { color: schoolColor }]}>
                    {className}
                  </Text>
                </View>
              ))}
            </View>

            {spell.subclasses && spell.subclasses.length > 0 && (
              <>
                <Text style={styles.subclassLabel}>Subclasses:</Text>
                <View style={styles.classesContainer}>
                  {spell.subclasses.map((subclass, index) => (
                    <View key={index} style={styles.subclassBadge}>
                      <Text style={styles.subclassText}>{subclass}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>

          <View style={styles.sourceSection}>
            <Text style={styles.sourceLabel}>Fonte:</Text>
            <Text style={styles.sourceText}>{spell.source}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleSection: {
    flex: 1,
  },
  spellName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  schoolLevel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  classesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  classBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  classText: {
    fontSize: 14,
    fontWeight: '500',
  },
  subclassLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    marginBottom: 8,
  },
  subclassBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  subclassText: {
    fontSize: 12,
    color: '#666',
  },
  sourceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
    elevation: 2,
  },
  sourceLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  sourceText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});